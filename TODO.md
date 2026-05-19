# TODO

- [x] Fix Add Review submission payload to include `name` so Mongoose `reviews.*.name` required validation passes.
- [ ] Add `expiryDate` (MM/YYYY) + `batchCode` (alphanumeric) fields to review creation.
- [ ] Add server-side validation and store these fields on pending/accepted reviews.
- [ ] Update admin pending reviews to include these fields.
- [ ] Test end-to-end submission and rendering.

- [ ] (Optional) Add client-side validation for `starRating` to ensure it’s between 1 and 5 before submitting.
- [ ] Test: add a review and confirm no `ValidationError: Product validation failed: reviews.X.name`.
- [x] Fix implemented: AddReviewModal now sends `name` in the review POST payload.


