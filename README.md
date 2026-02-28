## Kbnb

In this assignment you'll be working on a small property booking site. On this site users can filter and search for available properties, view property details and submit a request to book a property. The client side app integrates with a Node.js mock API implemented in the `server/` folder. You won't modify the mock API for any of the following tasks.

As you work through the tasks try to follow the existing code style and avoid reformatting the code base as this makes it hard for us to find your changes. Thanks!

To launch Kbnb (and the mock API) run:

- `npm install`
- `npm start`

Some of the tasks have unit tests associated with them. To run the unit tests run `npm test`. If you only want to run the tests for a specific task you can pass in the path to the test file, e.g. `npm test src/tests/filterUtil.test.js`.

## Tasks

### Filtering - Component Connection

**Topics:** React, Component Communication

The left panel of the home page contains controls for filtering the properties displayed in the right panel, however modifying the filters does not currently affect which properties are displayed.

For this task you'll need to refactor the app so that the filters are applied to the displayed properties. The filtering logic is already implemented in `src/lib/filterUtil.js` but it is not hooked up to the UI. For example: selecting "Canada" from the Location dropdown in the left panel should cause the right panel to only show properties from Canada.

To do this you'll need to use or modify the following files:

- `src/components/PropertyFilters/PropertyFilters.jsx`: the left panel containing the filter controls. The values for the controls are currently stored in this component's state in the `filters` variable.
- `src/components/PropertyGrid/PropertyGrid.jsx`: the right panel that displays the properties. The list of all properties is currently loaded from the API in this component and stored in state in the `properties` variable.
- `src/pages/Home/Home.jsx`: The home page. This is the parent component of `PropertyFilters` and `PropertyGrid`.
- `src/lib/filterUtil.js`: This file exports the `filterProperties()` function which contains the existing filtering logic. Use this function to apply the filters to the list of all properties.

### Filtering - Super Host

**Topics:** Vanilla JS, Runtime Complexity

Implement the "Super Host" filter on the left panel of the home page. Filters are applied by calling `filterProperties()` in `src/lib/filterUtil.js` which calls a placeholder function (`isSuperHost()`) for determining if a property is owned by a "Super Host".

A host is considered a "Super Host" if they have an average star rating >= 4 across all of the properties they own. Each property has a `hostId` field you can use to find all the properties owned by a certain host. For example if you had the following properties:

```
[
  {hostId: 1, stars: 3, ...},
  {hostId: 2, stars: 5, ...},
  {hostId: 2, stars: 3, ...},
]
```

All of Host 2's properties should be displayed when the Super Host filter is on because they have an average rating of 4 stars.

For this task focus on coming up with an efficient way to implement the "Super Host" filter such that you only iterate through the properties array a constant number of times when `filterProperties()` is called (in other words, `filterProperties()` should have O(n) runtime complexity). Feel free to make changes outside of the `isSuperHost()` function but the signature of `filterProperties()` should stay the same.

If you implemented the previous task you can test this through the UI but if not there are also unit tests in `src/test/filterUtil.test.js` that you can run to test this.

### Property Name Search

**Topics:** Vanilla JS, Data Structures

The search bar in the header should allow users to enter some text and see a list of all properties where the name starts with the given text.

To complete this feature implement `findMatches(propertyLookupTree, searchText)` in `src/components/AppHeader/AppHeader.jsx`. This function receives the search text entered by the user, and an object that represents a tree containing each property grouped by the letters in its name. For example if there were 3 properties named "B", "Bar" and "Baz" then propertyLookupTree would be:

```
{
  b: {
    match: {id: "b", name: "B"}
    a: {
      r: {
        match: {id: "bar", name: "Bar"}
      },
      z: {
        match: {id: "baz", name: "Baz"}
      }
    }
  }
}
```

While it is not necessary, it may help to implement the two function stubs `goToNode()` and `collectAllMatches()` and then use them to implement `findMatches()`. (This could also help you get partial credit if you don't get the solution totally working.)

### Style Property Details Page

**Topics:** CSS, Layout, Responsive Design

Add the following styling improvements to the property page (e.g. [localhost:5173/property/king-room-sky](http://localhost:5173/property/king-room-sky)) by editing `src/pages/property/property.scss`.

#### Acceptance Criteria

- When the screen width exceeds this page's max width of 1200px, the page should be centered.
- When the screen width is above the tablet breakpoint of 768px, `.property-booking-section` should have a fixed width of `18rem` and the `.property-info-section` should fill the remaining horizontal space.
- When the screen width is below the tablet breakpoint of 768px, `.property-booking-section` should appear on top of `.property-info-section` instead of the two sections being side by side. Both sections take up the full with of `.property-page`'s content.

### Check Availability

**Topics:** Vanilla JS, Asynchronous Programming

On the property page (e.g. [localhost:5173/property/king-room-sky](http://localhost:5173/property/king-room-sky)) as the user edits the "Check-in date" or "Duration of stay" fields the component should preemptively check the availability of the dates without requiring the user to click "Reserve" and show an error message if the dates are not available.

To complete this feature implement `onRequestedDatesChange(propertyId, checkinDate, duration, setShowAvailabilityError)` in `src/components/BookingForm/BookingForm.jsx`. This function is called whenever the user modifies the "Check-in date" or "Duration of stay" fields.

#### Acceptance Criteria

- Use `ApiUtil.checkAvailability(propertyId, checkinDate, duration)` to make an API request for checking availability.
- The API is not called until the user stops typing for 500ms and it is only called once with the latest input (in other words, add a 500ms debounce to the API call).
- The API is only called when `checkinDate` matches the `yyyy-mm-dd` format. For simplicity, something like "9999-00-77" can be considered a valid date but "2022-4" should not result in a call to the API.
- When it is determined whether the requests dates are available or not, call `setShowAvailabilityError()` with a boolean indicating if the error message should be displayed.
- After calling `ApiUtil.checkAvailability()`, if `onRequestedDatesChange()` is called again before the initial API responds then the response should be ignored.
- The availability of the check-in date should be checked even when the duration field is empty.

You can test unavailable dates by entering dates in the past. You can also test your solution by running the unit tests in `src/tests/BookingForm.test.js`.

### Pagination

**Topics:** Vanilla JS

In `src/lib/paginationUtil.js` implement `getPaginationLabels(totalPages, curPage, maxLabels)`.

This function returns an array of integers that will be used as the page numbers displayed in the pagination component.

#### Acceptance Criteria

- The first page, last page and `curPage` should always be returned.
- Additional pages should be added on either side of `curPage` until the resulting array contains all the pages or has a length of `maxLabels`.
- `curPage` should be at the center of the resulting array unless it to too close to the first or last page for this to be possible (see examples below).
- The unit tests in `src/tests/paginationUtil.test.js` should pass.

#### Examples

```
// curPage is centered
getPaginationLabels(100, 30, 5) // returns [1, 29, 30, 31, 100]

// curPage is too close to the start to be centered so pages are added to the right of it
getPaginationLabels(10, 2, 7) // returns [1, 2, 3, 4, 5, 6, 10]
```

For more examples see the unit tests in `src/tests/paginationUtil.test.js`.

### Booking Form

**Topics:** React, HTML Form Best Practices, User Experience

The form used to reserve a property is implemented in `src/components/BookingForm/BookingForm.jsx`.

When the form is submitted, call the API to reserve the property. The API endpoint for reserving a property (`/properties/{propertyId}/reserve`) is documented at [http://localhost:3001/api/docs/#/properties/post_properties__propertyId__reserve](http://localhost:3001/api/docs/#/properties/post_properties__propertyId__reserve).

Additionally, make any improvements to the booking form that will:

- Improve the user experience
- Handle errors, validation issues, and edge cases (for simplicity this can be done when the form is submitted instead of when inputs change)
- Keep the user informed of pending operations and their result
- Improve accessibility
- Apply HTML form best practices

Add a comment in `BookingForm.jsx` outlining the improvements you made.

Note: avoid making large changes to the functionality of the form. For example, replacing the date input with a date picker that shows the availability of each day would improve the user experience, but it is outside the scope of this task.
