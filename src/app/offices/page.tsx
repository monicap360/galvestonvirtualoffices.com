import { getOffices } from "@/lib/catalog";
import { createBooking } from "@/app/orders/actions";
import { money } from "@/lib/format";

export const metadata = { title: "Office Space & Meeting Rooms" };

export default async function OfficesPage() {
  const offices = await getOffices();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Private office & desks</h1>
        <p className="mt-3 text-slate-400">
          Book a private office or coworking desk at our Galveston location, online. Pay by business check —
          your reservation is confirmed once we receive and record it.
        </p>
      </header>

      {offices.length === 0 ? (
        <p className="mt-10 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-3">
          No spaces are listed yet. (Run the seed file, then refresh.)
        </p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {offices.map((o) => (
            <div key={o.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="badge bg-fuchsia-400/10 text-fuchsia-200 border border-fuchsia-400/30">{o.type}</span>
                  <h2 className="mt-2 text-xl font-semibold text-white">{o.name}</h2>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{money(o.price_per_day_cents)}<span className="text-sm font-normal text-slate-400">/day</span></div>
                  {o.price_per_month_cents && (
                    <div className="text-sm text-slate-400">{money(o.price_per_month_cents)}/mo</div>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">{o.description}</p>
              <p className="mt-2 text-xs text-slate-400">
                Seats {o.capacity}{o.size_sqft ? ` · ${o.size_sqft} sq ft` : ""}
              </p>

              <form action={createBooking} className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <input type="hidden" name="office_id" value={o.id} />
                <div>
                  <label className="label" htmlFor={`start-${o.id}`}>From</label>
                  <input id={`start-${o.id}`} name="start_date" type="date" required className="input" />
                </div>
                <div>
                  <label className="label" htmlFor={`end-${o.id}`}>To</label>
                  <input id={`end-${o.id}`} name="end_date" type="date" required className="input" />
                </div>
                <button className="btn-primary col-span-2 mt-1">Reserve & get invoice</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
