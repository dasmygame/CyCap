import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CYCAP</h3>
            <p className="text-gray-400">Empowering traders with expert analysis and community support.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#benefits" className="text-gray-400 hover:text-indigo-400 transition-colors">Benefits</Link></li>
              <li><Link href="#testimonials" className="text-gray-400 hover:text-indigo-400 transition-colors">Testimonials</Link></li>
              <li><Link href="#reviews" className="text-gray-400 hover:text-indigo-400 transition-colors">Reviews</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-indigo-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: support@cycap.com</p>
            <p className="text-gray-400">Phone: (123) 456-7890</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors"><Facebook /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors"><Twitter /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors"><Instagram /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors"><Youtube /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} CYCAP. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-indigo-400 transition-colors mr-4">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

