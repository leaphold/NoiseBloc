import './globals.css'
import React, {ReactNode} from 'react'
import { Tilt_Neon } from 'next/font/google'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Container from './components/Container/Container'

const quicksand = Tilt_Neon ({ subsets: ['latin'] })

export const metadata = {
  title: 'NoiseBlox',
  description: 'Blockchain integrated watermarking for digital media',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <Container>
        <Header />
        {children}
        <Footer />
        </Container>
      </body>
    </html>
  )
}
