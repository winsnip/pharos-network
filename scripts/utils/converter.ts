//Convert Bigint to Hex
export function toUint256Hex(value: bigint) {
  return '0x' + value.toString(16).padStart(64, '0');
}