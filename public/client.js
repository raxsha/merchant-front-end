/* globals Vue, Vuetify */
const SUITS = ["hearts", "diamonds", "clubs", "swords", "coins", "flesh"];
const RANKS = [
  "ace",
  "queen",
  "jack",
  "king",
  "page",
  "high priestess",
  "table"
];

function z(sides) {
  return Math.floor(Math.random() * sides);
}
function d(sides) {
  return z(sides) + 1;
}

function chooseRandomly(options) {
  return options[z(options.length)];
}

function randomItem() {
  return {
    suit: chooseRandomly(SUITS),
    rank: chooseRandomly(RANKS)
  };
}

function randomBundle() {
  let bundle = [];
  let count = d(5);
  for (let i = 0; i < count; i += 1) {
    bundle.push(randomItem());
  }
  return bundle;
}

function appraise(set) {
  // consistent rank bonus
  let combo = 1;
  let ranksInSet = new Set(set.map((item) => item.rank)).size;
  if (ranksInSet == 1 && set.length > 1) {
    console.log("consistent rank bonus!");
    combo += set.length;
  }
  // sequential rank bonus
  let ranksOfSet = set.map((item) => RANKS.indexOf(item.rank));
  if (
    set.length > 2 &&
    ranksInSet == set.length && // all different
    Math.max(ranksOfSet) - Math.min(ranksOfSet) == set.length - 1 // consecutive
  ) {
    console.log("sequential rank bonus!");
    combo += set.length;
  }
  // consistent suit bonus
  let suitsInSet = new Set(set.map((item) => item.suit)).size;
  if (suitsInSet == 1 && set.length > 1) {
    console.log("consistent suit bonus!");
    combo += set.length;
  }

  return (set.length + 1) * combo;
}

let app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    status: "everything is great",
    offer: null,
    money: 10,
    inventory: [
      { suit: "hearts", rank: "ace", selected: false },
      { suit: "hearts", rank: "queen", selected: false },
      { suit: "hearts", rank: "jack", selected: false }
    ]
  },
  created: async function () {
    console.log("called once by vue");
  },
  methods: {
    sell: function () {
      let remainingInventory = this.inventory.filter((item) => !item.selected);
      let selectedInventory = this.inventory.filter((item) => item.selected);
      this.money += appraise(selectedInventory);
      this.inventory = remainingInventory;
    },
    toggleSelect: function (item) {
      item.selected = !item.selected;
    },
    wait: function () {
      let bundle = randomBundle();
      this.offer = {
        bundle,
        reservationPrice: appraise(bundle)
      };
    },
    bid: function () {
      if (this.money < this.offer.bid) {
        this.offer = null;
        this.status = "You do not have that much!";
        return;
      }
      if (this.offer.bid >= this.offer.reservationPrice) {
        this.money -= this.offer.bid;
        for (let i = this.offer.bundle.length - 1; i >= 0; i -= 1) {
          this.inventory.unshift({
            suit: this.offer.bundle[i].suit,
            rank: this.offer.bundle[i].rank,
            selected: false
          });
        }
        this.offer = null;
        this.status =
          "The customer gives you the bundle, takes your offered coins, smiles happily and leaves.";
      } else {
        this.offer = null;
        this.status = "The customer has stormed out of the building";
        return;
      }
    }
  }
});
