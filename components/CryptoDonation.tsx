'use client'

const ETH_ADDRESS = '0x8d3b2461a4a3be80a3c8da503cb6caa8987d6b99'

export default function CryptoDonation() {
  const copy = () => navigator.clipboard?.writeText(ETH_ADDRESS)
  return (
    <section className="bg-edi-white py-24 px-8 flex flex-col items-center text-center">
      <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-4">Send Money</p>

      <div className="flex flex-col items-center gap-6">
        {/* QR — 1.5x: 160 → 240px */}
        <div className="w-60 h-60 border border-edi-light flex items-center justify-center bg-white">
          <img
            src="/qr-code.png"
            alt="Ethereum QR Code"
            width={240}
            height={240}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-body text-xs tracking-widest uppercase text-edi-gray">Ethereum (ETH)</p>
          <p
            className="font-body text-xs text-edi-black break-all max-w-xs md:max-w-none select-all cursor-pointer"
            onClick={copy}
          >
            {ETH_ADDRESS}
          </p>
          <p className="font-body text-xs text-edi-gray">(Adresse anklicken zum Kopieren)</p>
        </div>
      </div>
    </section>
  )
}
