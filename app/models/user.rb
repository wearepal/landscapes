class User < ApplicationRecord
  has_secure_password
  has_secure_token

  before_validation { email.downcase! }

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, on: :create

  before_create { self.admin = true if User.count == 0 }
end
