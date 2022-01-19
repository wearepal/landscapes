class RenameDigitaloceanService < ActiveRecord::Migration[6.1]
  def up
    ActiveStorage::Blob.where(service_name: "digitalocean").update_all(service_name: "s3")
  end

  def down
    ActiveStorage::Blob.where(service_name: "s3").update_all(service_name: "digitalocean")
  end
end
