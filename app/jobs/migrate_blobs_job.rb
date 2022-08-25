class MigrateBlobsJob < ApplicationJob
  queue_as :default

  def perform(from, to)
    src_service = ActiveStorage::Blob.services.fetch(from)
    dst_service = ActiveStorage::Blob.services.fetch(to)

    ActiveStorage::Blob.where(service_name: src_service.name).find_each do |blob|
      blob.open do |file|
        dst_service.upload(blob.key, file, checksum: blob.checksum)
      end

      blob.update! service_name: dst_service.name
    end
  end
end
