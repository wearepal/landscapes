module Varint
  # From https://github.com/codekitchen/ruby-protocol-buffers/blob/master/lib/protocol_buffers/runtime/varint.rb
  # License: BSD 3-clause
  def self.encode(io, int_val)
    if int_val < 0
      # negative varints are always encoded with the full 10 bytes
      int_val = int_val & 0xffffffff_ffffffff
    end
    loop do
      byte = int_val & 0b0111_1111
      int_val >>= 7
      if int_val == 0
        io << byte.chr
        break
      else
        io << (byte | 0b1000_0000).chr
      end
    end
  end
end
