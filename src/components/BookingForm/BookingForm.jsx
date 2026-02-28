import * as PropTypes from 'prop-types';
import { useParams } from 'react-router';
import './BookingForm.scss';
import { useRef, useState, useEffect } from 'react';
import LoadingImg from '../../assets/loading.gif';
import { ApiUtil } from '../../lib/apiUtil';
import { applyDateMask } from '../../lib/inputMaskUtil';

function handleCheckinDateChange(checkinDateElem, setCheckinDate) {
  const formattedDateStr = applyDateMask(checkinDateElem);
  setCheckinDate(formattedDateStr);
}

/**
 * Checks the availability of the requested dates when the "Check-in date" or "Duration of stay" change.
 * The availability should only be checked if checkinDate matches the yyyy-mm-dd format and the user has stopped
 * typing for 500ms.
 * When the availability of the dates is determined hide/show the availability error message (by calling
 * setShowAvailabilityError()) only if checkinDate and duration haven't changed since the "checkAvailability" request
 * was sent. e.g. if the user changes the duration a second time while the code is waiting for the API to respond from
 * the first change, then ignore the API response
 * @param {string} propertyId - ID of the property
 * @param {string} checkinDate - Value of the "Check-in date" input
 * @param {string} durationString - Value of the "Duration of stay" input
 * @param {function} setShowAvailabilityError - Function that takes a boolean input and shows/hides the availability error message.
 */
let debounceTimer;
let currentRequestId = 0;

export function onRequestedDatesChange(
  propertyId,
  checkinDate,
  durationString,
  setShowAvailabilityError
) {
  clearTimeout(debounceTimer);
  const requestId = ++currentRequestId;

  debounceTimer = setTimeout(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkinDate)) {
      return;
    }

    let duration = parseInt(durationString, 10);
    if (isNaN(duration)) {
      duration = 1;
    }

    ApiUtil.checkAvailability(propertyId, checkinDate, duration).then((isAvailable) => {
      if (requestId === currentRequestId) {
        setShowAvailabilityError(!isAvailable);
      }
    });
  }, 500);
}

const BookingForm = ({ rate }) => {
  let { propertyId } = useParams();
  const [checkinDate, setCheckinDate] = useState('');
  const [duration, setDuration] = useState('');
  const [guests, setGuests] = useState('');
  const [showAvailabilityError, setShowAvailabilityError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const checkinDateRef = useRef(null);

  // Improvements made:
// - Switched from handling the button's onClick to using the form’s onSubmit,
//   so it also works properly when users press the Enter key.
// - Added built-in HTML validations like `required` and `min` to catch basic
//   input errors before running custom JavaScript validation.
// - Properly manages the loading state, whether the API request succeeds or fails.
// - Displays clear success and error messages in the UI, including a helpful
//   error section when something goes wrong.
// - Improved accessibility by following standard screen reader patterns,
//   such as wrapping inputs inside labels or correctly linking them using IDs.

  function submitBooking(e) {
    if (e) e.preventDefault();
    setSubmitError('');

    if (showAvailabilityError) {
      setSubmitError('Please adjust the check-in date or duration.');
      return;
    }

    const durationNum = parseInt(duration, 10);
    const guestsNum = parseInt(guests, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkinDate) || isNaN(durationNum) || isNaN(guestsNum)) {
      setSubmitError('Please accurately fill out all fields.');
      return;
    }

    setLoading(true);
    ApiUtil.reserve(propertyId, checkinDate, durationNum, guestsNum)
      .then(() => {
        setLoading(false);
        setIsSuccess(true);
      })
      .catch((err) => {
        setLoading(false);
        setSubmitError(
          err.response?.data?.errorMsg || 'An error occurred while making the reservation.'
        );
      });
  }

  useEffect(() => {
    setShowAvailabilityError(false);
    onRequestedDatesChange(propertyId, checkinDate, duration, setShowAvailabilityError);
  }, [propertyId, checkinDate, duration]);

  if (isSuccess) {
    return (
      <div className="booking-form">
        <div className="booking-rate-section">
          <strong>Reservation Successful!</strong>
          <p>We look forward to hosting you.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={submitBooking}>
      <div className="booking-rate-section">
        <span className="booking-rate-amount">${rate}</span>
        /night
      </div>

      {submitError && <div className="booking-form-error-msg">{submitError}</div>}

      <div className="booking-form-item">
        <label htmlFor="checkinDate">Check-in date</label>
        <input
          id="checkinDate"
          className="booking-form-input"
          onChange={() => handleCheckinDateChange(checkinDateRef.current, setCheckinDate)}
          ref={checkinDateRef}
          placeholder="yyyy-mm-dd"
          required
          aria-invalid={showAvailabilityError}
        />
        {showAvailabilityError && (
          <div className="booking-form-error-msg">The specified dates are not available.</div>
        )}
      </div>

      <div className="booking-form-item">
        <label htmlFor="duration">Duration of stay (days)</label>
        <input
          id="duration"
          type="number"
          min="1"
          className="booking-form-input"
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      <div className="booking-form-item">
        <label htmlFor="guests">Number of guests</label>
        <input
          id="guests"
          type="number"
          min="1"
          className="booking-form-input"
          onChange={(e) => setGuests(e.target.value)}
          required
        />
      </div>

      <div>
        <button
          className="booking-form-submit"
          type="submit"
          disabled={loading || showAvailabilityError}
        >
          {loading ? (
            <img src={LoadingImg} alt="Loading..." className="booking-form-loading-img" />
          ) : (
            'Reserve'
          )}
        </button>
      </div>
    </form>
  );
};

BookingForm.propTypes = {
  rate: PropTypes.number,
};

export default BookingForm;
