class Team < ApplicationRecord
  has_many :memberships
  has_many :users, through: :memberships
  has_many :regions, dependent: :destroy
  has_many :label_schemas, dependent: :destroy
  has_many :models, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :datasets, dependent: :destroy
  has_many :extents, dependent: :destroy

  has_many :map_tile_layers, through: :regions
  has_many :overlays, through: :regions

  has_many :team_permissions
  has_many :permissions, through: :team_permissions
  has_many :expressions, dependent: :destroy

  after_create :assign_permissions

  validates :name, presence: true

  def permission(name)
    @p = Permission.find_by(name: name)
    tp = TeamPermission.find_by(team: self, permission: @p)
    tp ? tp.enabled : false
  end

  def update_permission(name)
    @p = Permission.find_or_create_by(name: name)
    tp = TeamPermission.find_or_create_by(team: self, permission: @p)
    tp.update(enabled: tp.enabled ? false : true)
  end

  private

  def assign_permissions
    Permission.all.each do |permission|
      TeamPermission.create(team: self, permission: permission, enabled: false)
    end
  end

end
