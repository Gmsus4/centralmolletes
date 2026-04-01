"use client"

import { CldUploadWidget } from "next-cloudinary"

type Props = {
  value: string
  onChange: (url: string) => void
  folder?: string
}

export default function ImageUpload({ value, onChange, folder = "products" }: Props) {
  return (
    <div className="space-y-2">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          folder: `central_molletes/${folder}`,
        }}
        onSuccess={(result) => {
          if (
            result.info &&
            typeof result.info === "object" &&
            "secure_url" in result.info
          ) {
            onChange(result.info.secure_url as string)
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="border-2 cursor-pointer border-dashed rounded-lg px-6 py-4 w-full hover:bg-gray-50 text-sm text-gray-500"
          >
            {value ? "Cambiar imagen" : "Subir imagen"}
          </button>
        )}
      </CldUploadWidget>

      {value && (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
          <img
            src={value}
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  )
}