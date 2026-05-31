/**
 * BookingButtons — single Viator affiliate booking button.
 * Props:
 *   activity: string — activity/tour name (e.g. "Hot Air Balloon")
 *   city: string     — city name (e.g. "Luxor")
 */
export default function BookingButtons({ activity, city }) {
  const query = encodeURIComponent(`${activity} ${city} Egypt`).replace(/%20/g, '+');
  const viatorUrl = `https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com%2Fsearch%2F${query}&campaign_id=108`;

  return (
    <a
      href={viatorUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full bg-[#29C766] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
    >
      Book on Viator →
    </a>
  );
}