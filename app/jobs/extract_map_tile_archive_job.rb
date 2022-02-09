class ExtractMapTileArchiveJob < ApplicationJob
  queue_as :slow

  include ActionView::Helpers::DateHelper

  class InvalidArchive < StandardError
  end

  discard_on(InvalidArchive) do |job, error|
    job.report_error "Not a valid tar archive"
  end

  # {layer}/{z}/{x}/{y}.{extension}
  FILENAME_REGEX = /\A([^\/]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)\.[^.]+\z/

  def perform(upload)
    num_extracted = 0
    Dir.mktmpdir do |dir|
      upload.update! message: "Fetching archive"
      upload.archive.open do |file|
        upload.update! message: "Extracting archive"
        unless system("tar", "-xf", file.path, "-C", dir)
          raise InvalidArchive
        end
      end

      upload.update! message: "Processing"
      Dir.glob("#{dir}/**/*").each_slice(100) do |paths|
        # There's a memory leak somewhere in here, so fork & destroy the process to save memory
        IO.pipe do |reader, writer|
          pid = Process.fork do
            Rails.application.executor.wrap do
              begin
                n = 0
                paths.each do |path|
                  filename = Pathname.new(path).relative_path_from(dir).to_s
                  FILENAME_REGEX.match(filename) do |m|
                    n += 1

                    layer = upload.region.map_tile_layers.find_or_create_by!(name: m[1])
                    
                    tile = layer.map_tiles.create_or_find_by!(
                      x: m[3].to_i,
                      y: m[4].to_i,
                      zoom: m[2].to_i
                    )

                    unless tile.source.attached? && tile.source.checksum == Digest::MD5.file(path).base64digest
                      File.open(path) do |file|
                        tile.source.attach io: file, filename: filename
                      end
                    end
                  end
                end
                Marshal.dump(n, writer)
              rescue Exception => e
                Marshal.dump(e, writer)
              end
              writer.close
            end
          end
          Process.wait pid
          result = Marshal.load(reader)
          if result.is_a? Exception
            raise result
          else
            num_extracted += result
          end
        end
      end

      upload.update!(
        message: "Extracted #{num_extracted} tiles"
      )
    end
  end

  def report_error(message)
    self.arguments.first.update! message: message
  end
end
