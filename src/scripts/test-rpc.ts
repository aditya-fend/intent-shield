import { publicClient } from '@/lib/viem';

async function testConnection() {
  try {
    // 1. Ambil Chain ID dari RPC
    const chainId = await publicClient.getChainId();
    
    // 2. Ambil Block Number terbaru
    const blockNumber = await publicClient.getBlockNumber();

    console.log('✅ Koneksi RPC Berhasil!');
    console.log(`Chain ID: ${chainId} (Expected: 84532 untuk Base Sepolia)`);
    console.log(`Block Number Terbaru: ${blockNumber}`);
  } catch (error) {
    console.error('❌ Gagal terhubung ke Base Sepolia RPC:', error);
  }
}

testConnection();