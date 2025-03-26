class Dataset < ApplicationRecord
  belongs_to :team
  has_one_attached :file
  has_many :dataset_shares, dependent: :destroy
  has_many :shared_teams, through: :dataset_shares, source: :team

  def share_with(team)
    return if team == self.team # Don't share with owner team
    dataset_shares.create!(team: team)
  end

  def unshare_with(team)
    dataset_shares.find_by(team: team)&.destroy
  end

  def shared_with?(team)
    return true if team == self.team # Owner team always has access
    dataset_shares.exists?(team: team)
  end

  def accessible_by?(team)
    shared_with?(team)
  end
end
