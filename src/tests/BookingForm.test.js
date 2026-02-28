import { vi } from 'vitest';
import { onRequestedDatesChange } from '../components/BookingForm/BookingForm';
import { ApiUtil } from '../lib/apiUtil';

const flushPromises = () => new Promise(process.nextTick);

async function waitAndFlushPromises(timeout) {
  vi.advanceTimersByTime(timeout); //let debounce timeout run
  await flushPromises(); //Wait for mocked API call to resolve
}

describe('BookingForm - onRequestedDatesChange()', () => {
  let checkAvailabilityMock;
  let setShowAvailabilityErrorMock;
  let checkAvailabilityResponse;

  beforeEach(async () => {
    vi.useFakeTimers();
    checkAvailabilityMock = vi.spyOn(ApiUtil, 'checkAvailability');
    checkAvailabilityResponse = true;
    checkAvailabilityMock.mockImplementation(() => Promise.resolve(checkAvailabilityResponse));
    setShowAvailabilityErrorMock = vi.fn();
  });

  it('Calls ApiUtil.checkAvailability()', async () => {
    onRequestedDatesChange('id', '2020-03-20', '1', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);

    expect(checkAvailabilityMock).toHaveBeenCalledWith('id', '2020-03-20', 1);
    expect(setShowAvailabilityErrorMock).toHaveBeenCalledWith(false);
  });

  it('Shows error message when property is not available', async () => {
    checkAvailabilityResponse = false;
    onRequestedDatesChange('id', '2020-03-20', '1', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);

    expect(setShowAvailabilityErrorMock).toHaveBeenCalledWith(true);
  });

  it('Doesn\'t call API when date format is invalid', async () => {
    checkAvailabilityResponse = false;
    onRequestedDatesChange('id', '2020-03-', '1', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);

    expect(setShowAvailabilityErrorMock).not.toHaveBeenCalled();
  });

  it('Only calls API once after user stops typing', async () => {
    checkAvailabilityResponse = false;
    onRequestedDatesChange('id', '2020-03-20', '1', setShowAvailabilityErrorMock);
    onRequestedDatesChange('id', '2020-03-21', '1', setShowAvailabilityErrorMock);
    onRequestedDatesChange('id', '2020-03-22', '1', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);

    checkAvailabilityResponse = true;
    onRequestedDatesChange('id', '2020-03-22', '1', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(300);

    checkAvailabilityResponse = false;
    onRequestedDatesChange('id', '2020-03-23', '1', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(300);

    checkAvailabilityResponse = true;
    onRequestedDatesChange('id', '2020-03-24', '1', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);

    expect(setShowAvailabilityErrorMock).toHaveBeenCalledTimes(2);
    expect(setShowAvailabilityErrorMock).toHaveBeenNthCalledWith(1, true);
    expect(setShowAvailabilityErrorMock).toHaveBeenNthCalledWith(2, false);
  });

  it('API responses are ignored if onRequestedDatesChange is called again while waiting for a response', async () => {
    checkAvailabilityMock.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(checkAvailabilityResponse), 2000);
      });
    });

    checkAvailabilityResponse = false;
    onRequestedDatesChange('id', '2020-03-20', '1', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);
    expect(checkAvailabilityMock).toHaveBeenCalledTimes(1);
    //API call has not finished yet
    expect(setShowAvailabilityErrorMock).toHaveBeenCalledTimes(0);

    await waitAndFlushPromises(2000);
    expect(setShowAvailabilityErrorMock).toHaveBeenCalledWith(true);

    checkAvailabilityResponse = true;
    onRequestedDatesChange('id', '2020-03-21', '2', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);
    expect(checkAvailabilityMock).toHaveBeenCalledTimes(2);
    expect(setShowAvailabilityErrorMock).toHaveBeenCalledTimes(1);

    onRequestedDatesChange('id', '2020-03-22', '2', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);
    await waitAndFlushPromises(1500);
    // At this point we have waited 2500ms since the request for 2020-03-21 so there should have been enough time for
    // the debounce to finish (500) and the API call (2000). However the API should not have been called since another
    // call to onRequestedDatesChange() was made
    expect(checkAvailabilityMock).toHaveBeenCalledTimes(3);
    expect(setShowAvailabilityErrorMock).toHaveBeenCalledTimes(1);

    await waitAndFlushPromises(500);
    //After waiting for the 3rd API request to finish setShowAvailabilityError() should be called a second time.
    expect(setShowAvailabilityErrorMock).toHaveBeenCalledTimes(2);
    expect(setShowAvailabilityErrorMock).toHaveBeenNthCalledWith(2, false);
  });

  it('Calls API when the duration is empty', async () => {
    onRequestedDatesChange('id', '2020-03-20', '', setShowAvailabilityErrorMock);
    await waitAndFlushPromises(500);

    expect(checkAvailabilityMock).toHaveBeenCalledWith('id', '2020-03-20', 1);
  });
});
