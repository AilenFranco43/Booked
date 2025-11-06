/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Configuración para resolver el error de useContext
  compiler: {
    styledComponents: true,
  },
  // Deshabilitar ESLint durante el build si es necesario
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Deshabilitar TypeScript checking durante el build si es necesario
  typescript: {
    ignoreBuildErrors: true,
  },
  // Para producción
  output: 'standalone', // o 'export' si haces static export
};

export default nextConfig;