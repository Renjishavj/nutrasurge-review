# TODO

- [ ] Fix Add Review submission payload to include `name` so Mongoose `reviews.*.name` required validation passes.
- [ ] (Optional) Add client-side validation for `starRating` to ensure it’s between 1 and 5 before submitting.
- [ ] Test: add a review and confirm no `ValidationError: Product validation failed: reviews.X.name`.
- [x] Fix implemented: AddReviewModal now sends `name` in the review POST payload.


