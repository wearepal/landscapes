class User < ApplicationRecord
  has_secure_password
  has_secure_token

  has_many :memberships
  has_many :teams, through: :memberships

  before_validation { email.downcase! }

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }
end
