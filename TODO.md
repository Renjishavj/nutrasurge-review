# TODO - Product Details + Reviews Moderation

- [ ] Update backend Product model to include embedded reviews with status pending/accepted/rejected
- [ ] Add backend routes:
  - [ ] GET /api/products/:id (include accepted reviews)
  - [ ] POST /api/products/:id/reviews (create pending review; set reviewDate)
  - [ ] GET /api/admin/reviews/pending
  - [ ] PATCH /api/admin/reviews/:reviewId (accept/reject)
- [ ] Update frontend routing in App.jsx to add /products/:id
- [ ] Update ProductList.jsx to navigate to product details on card click (Home only)
- [ ] Create ProductDetails.jsx (fetch product details + accepted reviews; Add Review button)
- [ ] Create AddReviewModal.jsx (name, message, star rating, editable date default today)
- [ ] Create AdminPendingReviews.jsx (list pending reviews; accept/reject)
- [ ] Update Dashboard.jsx to show AdminPendingReviews
- [ ] Test end-to-end flow manually (customer add → admin approve → product page display)

