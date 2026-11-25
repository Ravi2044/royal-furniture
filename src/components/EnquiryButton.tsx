import { useState } from 'react'
import { Check, MessageCircle } from 'lucide-react'
import type { Product } from '../types'
import { buildEnquiryMessage, getWhatsAppUrl } from '../lib/utils'

export function EnquiryButton({ product, className = 'btn-primary' }: { product?: Product; className?: string }) {
  const [copied, setCopied] = useState(false)
  const message = buildEnquiryMessage(product)
  const url = getWhatsAppUrl(message)

  const handleClick = async () => {
    if (url) { window.open(url, '_blank', 'noopener,noreferrer'); return }
    await navigator.clipboard.writeText(message)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  return <button type="button" className={className} onClick={handleClick}>{copied ? <Check size={19} /> : <MessageCircle size={19} />}{copied ? 'Enquiry copied' : 'Ask on WhatsApp'}</button>
}
