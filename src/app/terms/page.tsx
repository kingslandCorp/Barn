import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Booking Terms & Conditions',
  description: `Direct booking terms and conditions for ${siteConfig.fullName}.`,
  robots: { index: false, follow: false },
};

type Section = {
  heading: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    heading: '1. About us',
    body: (
      <>
        <p>
          Kingsland Barn (&ldquo;Kingsland Barn&rdquo;, &ldquo;the Barn&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo; or &ldquo;our&rdquo;) is holiday accommodation situated in the Vale of
          Glamorgan, Wales.
        </p>
        <p className="mt-3">
          Website:{' '}
          <a href="https://www.kingslandbarn.co.uk" className="text-coast underline">
            www.kingslandbarn.co.uk
          </a>
          <br />
          Bookings:{' '}
          <a href="mailto:booking@kingslandbarn.co.uk" className="text-coast underline">
            booking@kingslandbarn.co.uk
          </a>
        </p>
        <p className="mt-3">
          The person making the booking is referred to in these terms as the Lead Guest.
        </p>
      </>
    ),
  },
  {
    heading: '2. Making a booking',
    body: (
      <>
        <p>
          The Lead Guest must be at least 18 years old and have authority to make the booking on
          behalf of everyone staying at the Barn.
        </p>
        <p className="mt-3">
          An enquiry, discussion about dates or provisional reservation does not constitute a
          confirmed booking.
        </p>
        <p className="mt-3">
          For a direct booking, we will provide the Lead Guest with the booking details, price,
          payment option and access to these Terms &amp; Conditions before requesting payment.
        </p>
        <p className="mt-3">
          A direct booking becomes confirmed when we have received the payment required for the
          payment option selected. By making that payment, the Lead Guest confirms acceptance of
          these Terms &amp; Conditions on behalf of everyone included in the booking.
        </p>
        <p className="mt-3">The Lead Guest is responsible for:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>ensuring that information supplied to us is accurate;</li>
          <li>making payments when due;</li>
          <li>ensuring that all members of the party are aware of these Terms &amp; Conditions; and</li>
          <li>ensuring that guests and visitors comply with the relevant house and safety rules.</li>
        </ul>
      </>
    ),
  },
  {
    heading: '3. Price and payment',
    body: (
      <>
        <p>
          Where offered, guests booking directly with Kingsland Barn may choose between two
          payment options.
        </p>
        <h3 className="mt-4 font-display text-lg text-ink">Option 1 &ndash; Pay in Full &ndash; Save 10%</h3>
        <p className="mt-2">
          Guests may pay the full cost of their stay at the time of booking and receive a 10%
          discount from our standard accommodation price. This is our Non-Refundable Rate and is
          offered at a lower price in return for accepting more restrictive cancellation terms.
        </p>
        <p className="mt-2">
          Full payment of the discounted price is required to confirm the booking. The 10%
          discount applies to the accommodation price and cannot be combined with another
          discount or offer unless specifically agreed by us. The cancellation provisions in
          Section 5 apply.
        </p>
        <h3 className="mt-4 font-display text-lg text-ink">Option 2 &ndash; Standard Rate &ndash; 25% Deposit</h3>
        <p className="mt-2">
          Guests may instead book at our standard accommodation price by paying a 25% deposit at
          the time of booking. The remaining 75% balance is due 30 days before arrival.
        </p>
        <p className="mt-2">
          We will normally send the Lead Guest a reminder by email before the balance becomes due.
          Responsibility for making payment by the due date nevertheless remains with the Lead
          Guest.
        </p>
        <p className="mt-2">
          For bookings made 30 days or fewer before arrival, the full standard-rate booking price
          is payable when the booking is confirmed.
        </p>
        <p className="mt-2">
          If a balance remains unpaid after its due date, we will contact the Lead Guest and
          provide a reasonable opportunity to make payment. If payment remains outstanding, we may
          treat the booking as cancelled by the guest and the cancellation provisions below will
          apply.
        </p>
        <p className="mt-2">
          The payment option selected when the booking is confirmed cannot normally be changed
          retrospectively.
        </p>
      </>
    ),
  },
  {
    heading: '4. Changes to your booking',
    body: (
      <>
        <p>
          If you wish to change the dates or other details of a confirmed booking, please contact{' '}
          <a href="mailto:booking@kingslandbarn.co.uk" className="text-coast underline">
            booking@kingslandbarn.co.uk
          </a>{' '}
          as soon as possible.
        </p>
        <p className="mt-3">
          We will try to accommodate reasonable requests but cannot guarantee that a change will
          be possible.
        </p>
        <p className="mt-3">
          At our discretion, we may agree to move a booking to alternative available dates. Where
          alternative dates have a higher accommodation price, the difference will be payable.
        </p>
        <p className="mt-3">
          A substantial change of dates may be treated as cancellation of the original booking and
          creation of a new booking.
        </p>
      </>
    ),
  },
  {
    heading: '5. Cancellation by you',
    body: (
      <>
        <p>
          Cancellations must be made by the Lead Guest in writing to{' '}
          <a href="mailto:booking@kingslandbarn.co.uk" className="text-coast underline">
            booking@kingslandbarn.co.uk
          </a>
          . The amount refundable depends upon the payment option selected when the booking was
          made.
        </p>
        <h3 className="mt-4 font-display text-lg text-ink">
          5.1 Pay in Full &ndash; Save 10% / Non-Refundable Rate
        </h3>
        <p className="mt-2">
          If you selected our Pay in Full &ndash; Save 10% option, you accepted a discounted
          accommodation price in return for substantially more restrictive cancellation terms. If
          you cancel, the amount paid is therefore normally non-refundable.
        </p>
        <p className="mt-2">
          However, we will make reasonable efforts to re-let the cancelled dates. If we
          successfully re-let all or part of your cancelled stay, we will take replacement income
          and costs we have saved as a result of your cancellation into account. We will refund
          any amount retained which would otherwise result in us recovering materially more than
          our reasonable loss arising from your cancellation. We may deduct reasonable additional
          costs incurred in obtaining or administering a replacement booking.
        </p>
        <h3 className="mt-4 font-display text-lg text-ink">5.2 Standard Rate &ndash; 25% Deposit</h3>
        <p className="mt-2">If you selected our Standard Rate and cancel:</p>
        <p className="mt-2">
          <strong>More than 30 days before arrival:</strong> The 25% booking deposit will normally
          be retained and no further payment will be due.
        </p>
        <p className="mt-2">
          <strong>30 days or fewer before arrival:</strong> The full booking price will normally
          be payable and may be retained, subject to our obligation to take reasonable steps to
          reduce our loss.
        </p>
        <p className="mt-2">
          We will make reasonable efforts to re-let cancelled dates. If we successfully re-let all
          or part of your stay, we will take replacement income and costs saved into account when
          calculating our reasonable loss and refund any amount received from you which exceeds
          that loss.
        </p>
        <h3 className="mt-4 font-display text-lg text-ink">5.3 Travel insurance</h3>
        <p className="mt-2">
          We strongly recommend that guests obtain appropriate UK travel insurance when booking.
          Suitable insurance may provide cover for circumstances such as illness, accident,
          bereavement or other unexpected events which prevent you travelling.
        </p>
        <p className="mt-2">
          Our cancellation terms apply regardless of whether you choose to purchase travel
          insurance. Nothing in this section affects your statutory rights.
        </p>
      </>
    ),
  },
  {
    heading: '6. Cancellation by us',
    body: (
      <>
        <p>
          Very occasionally circumstances may mean that we cannot provide the accommodation you
          have booked. Examples may include serious property damage, failure of essential
          services, safety concerns or an emergency affecting the property.
        </p>
        <p className="mt-3">
          If we have to cancel your booking before your stay begins, we will notify you as soon as
          reasonably possible and refund all accommodation payments you have made to us for the
          cancelled stay.
        </p>
        <p className="mt-3">
          Where reasonably possible, we may offer alternative dates, but you are not obliged to
          accept them.
        </p>
        <p className="mt-3">
          We will not cancel a confirmed booking simply to accept another booking at a higher
          price.
        </p>
      </>
    ),
  },
  {
    heading: '7. Circumstances outside our reasonable control',
    body: (
      <>
        <p>
          Events can occasionally occur which neither we nor our guests could reasonably prevent
          or control. These may include severe weather, widespread utility failures, natural
          disasters, government restrictions or other exceptional circumstances.
        </p>
        <p className="mt-3">
          Where such circumstances materially affect a booking, we will communicate with you as
          soon as reasonably possible and consider reasonable alternatives depending upon the
          circumstances.
        </p>
        <p className="mt-3">
          Nothing in this section removes any statutory rights you may have where the
          accommodation cannot legally or practically be provided.
        </p>
      </>
    ),
  },
  {
    heading: '8. Arrival and departure',
    body: (
      <>
        <p>
          Check-in and check-out times will be stated in your booking confirmation or
          pre-arrival information.
        </p>
        <p className="mt-3">
          Please do not arrive before the agreed check-in time without prior agreement, as the
          Barn may still be undergoing cleaning and preparation.
        </p>
        <p className="mt-3">
          Guests must leave the property by the agreed check-out time so that it can be prepared
          for incoming guests.
        </p>
        <p className="mt-3">
          We reserve the right to make a reasonable additional charge where an unauthorised late
          departure causes additional cleaning, staffing or other costs.
        </p>
      </>
    ),
  },
  {
    heading: '9. Number of guests and visitors',
    body: (
      <>
        <p>
          The number of people staying at Kingsland Barn must not exceed the maximum occupancy
          stated in the booking or otherwise agreed with us.
        </p>
        <p className="mt-3">Only registered guests may stay overnight.</p>
        <p className="mt-3">
          Please contact us before inviting significant numbers of additional daytime visitors to
          the property.
        </p>
        <p className="mt-3">
          Kingsland Barn must not be used for parties, events, commercial activities, photo or
          video shoots or other organised gatherings unless specifically agreed with us in
          advance.
        </p>
        <p className="mt-3">
          We may refuse or terminate a stay where the property is being used for an unauthorised
          event or where occupancy materially exceeds that agreed.
        </p>
      </>
    ),
  },
  {
    heading: '10. Use of the property',
    body: (
      <>
        <p>
          Kingsland Barn is provided as temporary holiday accommodation. Guests must use the
          property responsibly and must not:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>cause unreasonable nuisance or disturbance;</li>
          <li>behave in a threatening, abusive or antisocial manner;</li>
          <li>use the property for illegal purposes;</li>
          <li>smoke or vape inside the Barn;</li>
          <li>use candles or other unauthorised naked flames inside the property;</li>
          <li>interfere with smoke alarms, carbon monoxide alarms or other safety equipment;</li>
          <li>interfere with swimming pool, heating, electrical or other property equipment; or</li>
          <li>
            do anything likely to invalidate our insurance or create an unreasonable risk to
            people or property.
          </li>
        </ul>
        <p className="mt-3">
          Guests must respect our neighbours and the rural setting, particularly during the
          evening and at night.
        </p>
      </>
    ),
  },
  {
    heading: '11. Children',
    body: (
      <>
        <p>
          Children are very welcome at Kingsland Barn but remain the responsibility of their
          parent, guardian or responsible adult at all times.
        </p>
        <p className="mt-3">
          The property is a rural home and includes features which may present hazards to
          children, including the swimming pool, stairs, outdoor areas and surrounding
          countryside.
        </p>
        <p className="mt-3">
          Children must be appropriately supervised according to their age and abilities.
        </p>
      </>
    ),
  },
  {
    heading: '12. Swimming pool',
    body: (
      <>
        <p>
          Kingsland Barn has a private outdoor swimming pool for guest use when it is open and
          available. There is no lifeguard.
        </p>
        <p className="mt-3">
          Children and anyone who is not a confident swimmer must be supervised by a responsible
          adult at all times when in or around the pool. Guests must follow the pool and safety
          guidance provided at the property.
        </p>
        <p className="mt-3">Guests must not:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>dive into the pool;</li>
          <li>run around the pool area;</li>
          <li>use glassware in or around the pool;</li>
          <li>use the pool while significantly affected by alcohol or drugs;</li>
          <li>interfere with pool heating, filtration, dosing or other equipment; or</li>
          <li>allow children to use the pool unsupervised.</li>
        </ul>
        <p className="mt-3">
          Pool availability and temperature can occasionally be affected by weather, maintenance
          or technical issues. We will take reasonable steps to maintain the pool and keep it
          available as advertised but cannot guarantee a precise water temperature at all times.
          If a significant problem occurs, please tell us promptly so that we have an opportunity
          to investigate and rectify it.
        </p>
      </>
    ),
  },
  {
    heading: '13. Wood burner and fire safety',
    body: (
      <>
        <p>
          Guests choosing to use the wood burner must do so responsibly and follow any
          instructions provided. Only appropriate fuel should be burned.
        </p>
        <p className="mt-3">
          Children should be supervised around the wood burner and an unsafe fire must not be left
          unattended.
        </p>
        <p className="mt-3">
          Fire doors, smoke alarms, carbon monoxide alarms and other safety equipment must not be
          disabled, covered or interfered with.
        </p>
      </>
    ),
  },
  {
    heading: '14. Dogs and other animals',
    body: (
      <>
        <p>
          Dogs are welcome where they have been included in the booking or agreed with us in
          advance. Guests bringing dogs are responsible for them throughout their stay.
        </p>
        <p className="mt-3">
          Dogs must not cause unreasonable nuisance or damage and must be appropriately controlled
          around livestock, neighbouring properties and other animals.
        </p>
        <p className="mt-3">
          Guests must clean up after their dogs both at the property and in surrounding areas.
        </p>
        <p className="mt-3">
          Dogs should not be left unattended at the Barn for prolonged periods where this is
          likely to cause distress, barking or damage.
        </p>
        <p className="mt-3">
          Guests are responsible for damage or exceptional cleaning reasonably attributable to
          their animals.
        </p>
        <p className="mt-3">
          Other pets may only be brought to Kingsland Barn with our prior agreement.
        </p>
      </>
    ),
  },
  {
    heading: '15. Rural location and livestock',
    body: (
      <>
        <p>
          Kingsland Barn is situated in the Welsh countryside. Guests should expect normal
          features of rural life, which may include agricultural activity, livestock, wildlife,
          insects, uneven ground, mud, farm vehicles, countryside smells and occasional noise.
        </p>
        <p className="mt-3">
          Livestock may be present in neighbouring or surrounding fields. Dogs and children must
          therefore be supervised appropriately.
        </p>
      </>
    ),
  },
  {
    heading: '16. Parking and vehicles',
    body: (
      <>
        <p>Vehicles are parked at the property at their owner&rsquo;s risk.</p>
        <p className="mt-3">
          Please park only in designated or agreed areas and avoid blocking access required by
          neighbours, agricultural vehicles or emergency services.
        </p>
        <p className="mt-3">
          Electric vehicles must only be charged using an EV charging point specifically provided
          or approved for that purpose. Charging an electric vehicle from an ordinary domestic
          socket without our prior agreement is not permitted.
        </p>
      </>
    ),
  },
  {
    heading: '17. Wi-Fi, television and communications',
    body: (
      <>
        <p>Wi-Fi is provided for normal guest use.</p>
        <p className="mt-3">
          Because Kingsland Barn is in a rural location, internet, mobile telephone, television
          and other external services may occasionally be interrupted or operate at reduced
          speed. We will take reasonable steps to resolve problems within our control but cannot
          guarantee uninterrupted availability of services supplied by third-party networks or
          utilities.
        </p>
        <p className="mt-3">Guests must not use the internet connection for unlawful purposes.</p>
      </>
    ),
  },
  {
    heading: '18. Utilities and temporary interruptions',
    body: (
      <>
        <p>
          We take reasonable steps to ensure that electricity, water, heating, hot water and other
          essential services are available throughout your stay.
        </p>
        <p className="mt-3">
          Occasional interruptions may occur, particularly where caused by utility suppliers,
          severe weather or circumstances outside our reasonable control. Please report any
          significant failure promptly. We will take reasonable steps to investigate and rectify
          problems within our control.
        </p>
      </>
    ),
  },
  {
    heading: '19. Care and cleanliness of the Barn',
    body: (
      <>
        <p>Please treat Kingsland Barn and its contents with reasonable care.</p>
        <p className="mt-3">
          Guests are expected to leave the property in a reasonably clean and tidy condition.
          Normal cleaning following a stay is included in the accommodation price unless stated
          otherwise.
        </p>
        <p className="mt-3">
          We may charge reasonable additional costs where exceptional cleaning is required because
          the property has been left substantially beyond the condition reasonably expected
          following an ordinary holiday stay.
        </p>
      </>
    ),
  },
  {
    heading: '20. Damage, breakages and missing items',
    body: (
      <>
        <p>We understand that accidents happen.</p>
        <p className="mt-3">
          Please tell us promptly if something is damaged, broken or lost. Early notification
          often allows us to resolve a problem quickly and minimise the cost.
        </p>
        <p className="mt-3">
          The Lead Guest is responsible for reasonable costs arising from loss or damage caused
          deliberately or negligently by the Lead Guest, members of their party, visitors or
          animals for whom they are responsible. We will not charge for fair wear and tear.
        </p>
        <p className="mt-3">
          Where we seek payment for damage, replacement or exceptional cleaning, the amount
          claimed will reflect the reasonable cost of repair, replacement or cleaning, taking
          account where appropriate of the age and condition of the item. We may provide
          photographs, invoices, quotations or other reasonable evidence of the loss.
        </p>
      </>
    ),
  },
  {
    heading: '21. Security deposits',
    body: (
      <>
        <p>
          Where a refundable security or damage deposit is required for a particular booking, the
          amount will be made clear before the booking is confirmed.
        </p>
        <p className="mt-3">
          We may make reasonable deductions for damage, loss or exceptional cleaning for which the
          booking party is responsible. We will explain any deduction and return the remaining
          balance within a reasonable period following inspection of the property.
        </p>
        <p className="mt-3">
          Where reasonable losses exceed the security deposit, the Lead Guest remains responsible
          for the additional amount.
        </p>
      </>
    ),
  },
  {
    heading: '22. Problems during your stay',
    body: (
      <>
        <p>We want guests to enjoy their stay, so please tell us promptly if something is wrong.</p>
        <p className="mt-3">
          Where reasonably possible, problems should be reported while you are at Kingsland Barn
          so that we have an opportunity to investigate and put matters right.
        </p>
        <p className="mt-3">
          For urgent issues during your stay, please use the contact information supplied with
          your arrival information.
        </p>
        <p className="mt-3">Reporting a problem promptly does not affect your statutory rights.</p>
      </>
    ),
  },
  {
    heading: '23. Access to the property',
    body: (
      <>
        <p>
          We respect our guests&rsquo; privacy and will not normally enter the Barn during a stay.
        </p>
        <p className="mt-3">However, we may require reasonable access where necessary to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>deal with an emergency;</li>
          <li>investigate or repair a reported problem;</li>
          <li>undertake essential maintenance;</li>
          <li>protect people or the property from damage; or</li>
          <li>address a serious breach of these terms.</li>
        </ul>
        <p className="mt-3">
          Except in an emergency or where immediate access is reasonably necessary, we will try to
          contact the Lead Guest before entering.
        </p>
      </>
    ),
  },
  {
    heading: '24. Safety and emergencies',
    body: (
      <>
        <p>
          Guests should familiarise themselves with the safety information provided at Kingsland
          Barn, including fire exits and emergency procedures.
        </p>
        <p className="mt-3">
          In an emergency involving immediate danger to life or property, guests should contact
          the appropriate emergency service first.
        </p>
        <p className="mt-3">Guests must follow reasonable safety instructions provided by us.</p>
      </>
    ),
  },
  {
    heading: '25. Personal belongings',
    body: (
      <>
        <p>
          Guests are responsible for looking after their own belongings during their stay. Please
          take reasonable precautions to secure valuables and vehicles.
        </p>
        <p className="mt-3">
          If you leave something behind, contact us and we will make reasonable efforts to locate
          it. Reasonable postage, courier and packaging costs associated with returning belongings
          may be charged to you.
        </p>
      </>
    ),
  },
  {
    heading: '26. Our responsibility to you',
    body: (
      <>
        <p>
          We are responsible for providing the accommodation with reasonable care and skill and
          substantially as described when you booked it.
        </p>
        <p className="mt-3">
          Nothing in these Terms &amp; Conditions excludes or limits liability where it would be
          unlawful to do so, including liability for death or personal injury caused by our
          negligence, fraud or fraudulent misrepresentation, or your statutory consumer rights.
        </p>
        <p className="mt-3">
          We are not responsible for loss or damage that we could not reasonably have foreseen,
          that was caused by the guest&rsquo;s own act or omission, or that results from
          circumstances outside our reasonable control, except where the law provides otherwise.
        </p>
      </>
    ),
  },
  {
    heading: '27. Guest conduct and ending a stay early',
    body: (
      <>
        <p>
          In serious circumstances, we may require a guest or party to leave Kingsland Barn before
          the end of their booking. This would only normally be considered where there is a
          material breach of these Terms &amp; Conditions, including:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>serious antisocial, abusive or threatening behaviour;</li>
          <li>deliberate or reckless damage;</li>
          <li>an unauthorised party or event;</li>
          <li>serious or repeated disturbance to neighbours;</li>
          <li>illegal activity;</li>
          <li>materially exceeding the agreed occupancy; or</li>
          <li>refusing to follow an important safety instruction.</li>
        </ul>
        <p className="mt-3">
          Where reasonably possible, we will first give the Lead Guest an opportunity to resolve
          the problem. Any refund in these circumstances will depend upon the circumstances and
          the reasonable losses arising from the breach.
        </p>
      </>
    ),
  },
  {
    heading: '28. Third-party bookings',
    body: (
      <>
        <p>
          Where a booking is made through Airbnb or another booking platform, that platform&rsquo;s
          terms, payment arrangements and applicable cancellation policy will apply where they
          conflict with these direct booking terms.
        </p>
        <p className="mt-3">
          Our property-specific house and safety rules continue to apply during the stay where
          they have been made available as part of the booking.
        </p>
      </>
    ),
  },
  {
    heading: '29. Website information and photographs',
    body: (
      <>
        <p>
          We make reasonable efforts to ensure that descriptions, photographs and information
          about Kingsland Barn are accurate.
        </p>
        <p className="mt-3">
          The property and its surroundings naturally change over time and furnishings, equipment
          or decorative items may occasionally differ from photographs.
        </p>
        <p className="mt-3">
          We will not make a material change affecting a confirmed booking without informing the
          Lead Guest where reasonably possible.
        </p>
      </>
    ),
  },
  {
    heading: '30. Accessibility and individual requirements',
    body: (
      <>
        <p>
          Kingsland Barn is a converted rural property and may not be suitable for every guest or
          every accessibility requirement.
        </p>
        <p className="mt-3">
          If you or a member of your party has a particular mobility, accessibility or other
          requirement which is important to your stay, please contact us before booking. We will
          provide reasonable information about the property to help you decide whether it is
          suitable.
        </p>
      </>
    ),
  },
  {
    heading: '31. Privacy and personal information',
    body: (
      <>
        <p>
          We use personal information provided in connection with bookings for purposes including
          administering your stay, communicating with you, processing payments, complying with
          legal obligations and protecting our legitimate interests.
        </p>
        <p className="mt-3">
          Further information about how we handle personal information is available in the{' '}
          <a href="/privacy" className="text-coast underline">
            Privacy Policy
          </a>{' '}
          on our website.
        </p>
        <p className="mt-3">
          Payments may be processed using third-party payment providers, including Stripe, which
          will process payment information in accordance with its own privacy and security
          arrangements.
        </p>
      </>
    ),
  },
  {
    heading: '32. Statutory charges, visitor levies and registration',
    body: (
      <>
        <p>
          We will comply with applicable Welsh requirements relating to the registration and
          operation of visitor accommodation.
        </p>
        <p className="mt-3">
          If a statutory visitor levy, tourism tax or similar mandatory charge becomes applicable
          to your stay, we will tell you how the charge applies.
        </p>
        <p className="mt-3">
          Where a mandatory charge is known and applicable when you book, it will be included or
          clearly identified in the price information provided before your booking is confirmed.
          Where legislation introduces a new statutory charge after a booking has been made, it
          will be dealt with in accordance with the legislation governing that charge.
        </p>
      </>
    ),
  },
  {
    heading: '33. Complaints',
    body: (
      <>
        <p>
          If you have a complaint, please raise it with us as soon as possible so that we have a
          reasonable opportunity to investigate and resolve the issue.
        </p>
        <p className="mt-3">
          Please contact:{' '}
          <a href="mailto:booking@kingslandbarn.co.uk" className="text-coast underline">
            booking@kingslandbarn.co.uk
          </a>
        </p>
        <p className="mt-3">We will try to resolve complaints fairly and promptly.</p>
      </>
    ),
  },
  {
    heading: '34. Severability',
    body: (
      <p>
        If any provision of these Terms &amp; Conditions is found to be invalid or unenforceable,
        the remaining provisions will continue to apply.
      </p>
    ),
  },
  {
    heading: '35. Changes to these Terms & Conditions',
    body: (
      <>
        <p>We may update these Terms &amp; Conditions from time to time.</p>
        <p className="mt-3">
          The version applying to your booking will normally be the version provided or made
          available to you when the booking was made, unless a change is required by law or
          subsequently agreed with you.
        </p>
      </>
    ),
  },
  {
    heading: '36. Governing law',
    body: (
      <>
        <p>
          These Terms &amp; Conditions and any dispute arising from them are governed by the laws
          of England and Wales.
        </p>
        <p className="mt-3">
          As a consumer, you retain any rights you have under applicable law concerning where
          proceedings may be brought.
        </p>
      </>
    ),
  },
  {
    heading: '37. Your statutory rights',
    body: (
      <>
        <p>
          Nothing in these Terms &amp; Conditions is intended to exclude, restrict or otherwise
          affect any statutory rights available to you as a consumer.
        </p>
        <p className="mt-3">
          By making payment for a direct booking with Kingsland Barn, you confirm that you have
          been given the opportunity to read these Terms &amp; Conditions and accept them on
          behalf of yourself and all members of your booking party.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 pb-24 sm:px-8 sm:py-24 lg:px-12">
      <Reveal>
        <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
          Direct Booking Terms &amp; Conditions
        </p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
          Booking Terms &amp; Conditions
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          Last updated: September 2026. These Terms &amp; Conditions apply to bookings made
          directly with Kingsland Barn, including bookings made through{' '}
          <a href="https://www.kingslandbarn.co.uk" className="text-coast underline">
            www.kingslandbarn.co.uk
          </a>{' '}
          or by email.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          If you book Kingsland Barn through Airbnb or another third-party booking platform, the
          booking, payment and cancellation terms of that platform will normally apply instead.
          Our property-specific house and safety rules will continue to apply during your stay.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          Please read these Terms &amp; Conditions carefully before making payment. By making a
          payment for a direct booking, you confirm that you have read and accepted these Terms
          &amp; Conditions on behalf of yourself and all members of your party.
        </p>
      </Reveal>

      <div className="mt-14 max-w-2xl space-y-10">
        {sections.map((section) => (
          <Reveal key={section.heading}>
            <h2 className="font-display text-xl text-ink sm:text-2xl">{section.heading}</h2>
            <div className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-base">
              {section.body}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
