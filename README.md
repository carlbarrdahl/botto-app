# b0tt0

### Getting started

```sh
npm start # run frontend
cd functions && npm run serve # run backend

```

#### Stripe webhooks

```sh
# install stripe-cli first
# listen to webhooks
stripe listen --forward-to localhost:5001/botto-app/europe-west1/api/webhook

# trigger events (update fixtures with data)
stripe fixtures fixtures/checkout.session.completed.json

```

### Deployment

```sh
firebase functions:config:set stripe.sk=""
firebase functions:config:set stripe.wh_secret=""

# Register url in Stripe (if needed)
# https://europe-west1-botto-app.cloudfunctions.net/api/webhook
```

## Pitch

- Driver du café, bar eller restaurang och vill minska köbildning? Testa b0tt0!
- Med b0tt0 kan du ta emot beställningar online och notifiera kunden när ordern är redo att hämtas

## Shop

- What happens if a shop syncs products while users are placing orders?

### Requirements

- [x] devops: hide secrets
- [ ] devops: test / prod environments
- [ ] devops: secure Stripe (state)
- [x] create user
- [x] load user
- [x] load shop
- [x] display shop name
- [ ] display shop image
- [x] display menu
- [x] build order
- [x] place order
- [x] list orders
- [x] pay order
- [ ] use stripe customer id
- [ ] see queue position
- [ ] see order info
- [x] create stripe customer on first auth
- [x] navigation (account, orders, shops, admin)
- [ ] google e-com analytics
- [ ] admin: create shop
- [x] admin: connect stripe
- [x] admin: sync products
- [x] admin: update shop name
- [ ] admin: update shop image
- [ ] admin: push orders
- [ ] remove completed and stale orders

```js
const state = {
  orders: {
    [orderId]: {
      lineItems: [],
      stripeAccount: "",
      uid: "uid",
    },
  },
  users: {
    [userId]: {
      customer_id: "stripe_customer_id",
      orders: {
        [orderId]: "orderId",
      },
    },
  },
  shops: {
    [stripe_user_id]: {
      uid: "",
      name: "Shop",
      skus: [
        {
          id: "",
          price: "",
          currency: "",
          product: {
            name,
          },
        },
      ],
    },
  },
}
```
