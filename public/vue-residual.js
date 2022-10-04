class Vue {
  constructor(args) {
    this.args = args;

    // first render
    this.render();

    this.args.created();
  }

  // instead of any kind of diffing, we just destroy everything and build it again
  render() {
    let { el, data } = this.args;
    let { offer, status } = data;

    let mountPoint = document.querySelector(el);

    // we could reuse this code for updates, if we cleared the old stuff out like this:
    while (mountPoint.firstChild) {
      mountPoint.removeChild(mountPoint.firstChild);
    }

    if (offer) {
      let offerCard = document.createElement("div");
      offerCard.appendChild(
        document.createTextNode("What will you give me for this?")
      );
      let bundle = offer.bundle;
      for (let i = 0; i < bundle.length; i += 1) {
        let item = bundle[i];
        let listItem = document.createElement("div");
        listItem.appendChild(
          document.createTextNode(`${item.rank} of ${item.suit}`)
        );
        offerCard.appendChild(listItem);
      }
      let textField = document.createElement("input");
      textField.setAttribute("type", "text");
      textField.setAttribute("label", "offer");
      textField.value = offer.bid || 0;
      textField.addEventListener("change", () => {
        this.args.data.offer.bid = textField.value;
      });
      mountPoint.appendChild(textField);
      let bidButton = document.createElement("button");
      bidButton.appendChild(document.createTextNode("Bid"));
      bidButton.addEventListener("click", () => {
        // call "bid" method with "data" as this, and the value of the "offer" text field as the first non-this argument
        this.args.methods.bid.call(this.args.data);
        this.render();
      });
      offerCard.appendChild(bidButton);
      mountPoint.appendChild(offerCard);
    } else {
      let elseCard = document.createElement("div");
      elseCard.appendChild(document.createTextNode(data.status));
      let waitButton = document.createElement("button");
      waitButton.appendChild(document.createTextNode("Wait"));
      waitButton.addEventListener("click", (event) => {
        event.stopPropagation();
        // call "wait" method with "data" as this
        this.args.methods.wait.call(this.args.data);
        this.render();
      });
      elseCard.appendChild(waitButton);
      mountPoint.appendChild(elseCard);
    }
    let sellButton = document.createElement("button");
    sellButton.appendChild(document.createTextNode("Sell"));
    sellButton.addEventListener("click", (event) => {
      event.stopPropagation();
      // call "sell method with "data" as this
      this.args.methods.sell.call(this.args.data);
      this.render();
    });
    mountPoint.appendChild(sellButton);
    let inventoryCard = document.createElement("div");
    inventoryCard.appendChild(document.createTextNode(data.money));
    for (let item of data.inventory) {
      let itemButton = document.createElement("button");
      itemButton.appendChild(
        document.createTextNode(`${item.rank} of ${item.suit}`)
      );
      if (item.selected) {
        itemButton.style.color = "lightgreen";
      } else {
        itemButton.style.color = "gray";
      }
      itemButton.addEventListener("click", () => {
        // call "sell method with "data" as this
        this.args.methods.toggleSelect.call(this.args.data, item);
        this.render();
      });
      inventoryCard.appendChild(itemButton);
    }
    mountPoint.appendChild(inventoryCard);
  }
}

class Vuetify {
  // TODO
}
