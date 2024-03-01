import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [quantity, setQuantity] = useState(0);
  const [items, setItems] = useState([
    { item: "Bread", quantity: 0, price: 20 },
    { item: "Cheese", quantity: 0, price: 15 },
    { item: "Paneer", quantity: 0, price: 10 },
    { item: "Aloo", quantity: 0, price: 10 },
  ]);
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modal, setModal] = useState(false);
  const [mobile, setMobile] = useState("");
  const [itemStack, setItemStack] = useState([]);
  const [error, setError] = useState("");
  let ingredients = {
    Bread: "====================",
    Paneer: "*************************",
    Cheese: "-------------------------",
    Aloo: "^^^^^^^^^^^^^^^^",
  };

  useEffect(() => {
    const isQuantity = items.some(({ quantity }) => quantity > 0);
    setQuantity(quantity > 0 ? quantity : isQuantity ? 1 : 0);
    setTotalPrice(quantity * price);
  }, [items, quantity]);

  const handleQuantity = (operator) => {
    const isQuantity = items.some(({ quantity }) => quantity > 0);
    if (isQuantity) {
      if (operator === "inc") {
        setQuantity((prevQuan) => (prevQuan += 1));
      } else {
        setQuantity(quantity === 0 ? 0 : quantity - 1);
      }
    }
  };


  // to handle the increment of each ingredient
  const handleInc = (name) => {
    // to handle the quantity of each item
    const burgerItems = [...items];
    const index = burgerItems.findIndex((item) => item.item === name);
    burgerItems[index].quantity += 1;
    setItems(burgerItems);

    // to add item to the stack
    setItemStack((prevItem) => [name, ...prevItem]);

    const addPrice = items.reduce((acc, obj) => {
      return acc + obj.quantity * obj.price;
    }, 0);
    setPrice(addPrice);
  };

  // to handle the decrement of each ingredient
  const handleDec = (name) => {
    const burgerItems = [...items];
    const index = burgerItems.findIndex((item) => item.item === name);
    burgerItems[index].quantity =
      burgerItems[index].quantity === 0
        ? 0
        : (burgerItems[index].quantity -= 1);
    setItems(burgerItems);

    // to remove items from the stack
    const stack = [...itemStack];
    const findIndex = itemStack.findIndex((item) => item === name);
    if (findIndex !== -1) {
      let newArr = stack.splice(findIndex, 1);
      setItemStack(stack);
    }

    const addPrice = items.reduce((acc, obj) => {
      return acc + obj.quantity * obj.price;
    }, 0);
    setPrice(addPrice);
  };

  const handleChange = ({target: {value}}) => {
    setMobile(value)
    setError("");
    console.log(/^[0-9]*$/.test(value))
    if(!/^[0-9]*$/.test(value)){
      console.log("error")
      setError("Enter valid number")
    }
    else if(value.length < 10){
      setError("Mobile number must be atleast 10")
    }else setError("");
  }


  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      let burger = {};
      items.map((item) => burger[item.item] = item.quantity);
      console.log(burger)
      if(!mobile) return alert("Please enter mobile number")
      const {data} = await axios.post("http://localhost:8080/api/order",{
        mobile,
        itemStack,
        price,
        quantity,
        burger
    });
    alert("burger added to the database");
    const resetItems = items.map(item => ({ ...item, quantity: 0 }));
    setItems(resetItems);
    setModal(false);
    setQuantity(0);
    setItemStack([]);
    setPrice(0);
    setTotalPrice(0);
    } catch (error) {
        if(error.response.data.message === "Fill all the fields"){
          alert("Fill all the fields or try again");
          setModal(false);
        }
    }
  }
  return (
    <div className="App">
      {modal && (
        <div className="overlay">
          <div className="modal">
            <form onSubmit={handleSubmit}>
              <input type="text" onChange={handleChange} placeholder="Enter mobile number" />
              <div style={{color: "red"}}>{error}</div>
              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button onClick={() => setModal(false)} className="place-order">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="burger-items">
        <div className="burger-item">
          <button className="arth-buttons" onClick={() => handleInc("Bread")}>
            +
          </button>
          <div>Bread</div>
          <button className="arth-buttons" onClick={() => handleDec("Bread")}>
            -
          </button>
        </div>
        <div className="burger-item">
          <button className="arth-buttons" onClick={() => handleInc("Paneer")}>
            +
          </button>
          <div>Paneer</div>
          <button className="arth-buttons" onClick={() => handleDec("Paneer")}>
            -
          </button>
        </div>
        <div className="burger-item">
          <button className="arth-buttons" onClick={() => handleInc("Cheese")}>
            +
          </button>
          <div>Cheese</div>
          <button className="arth-buttons" onClick={() => handleDec("Cheese")}>
            -
          </button>
        </div>
        <div className="burger-item">
          <button className="arth-buttons" onClick={() => handleInc("Aloo")}>
            +
          </button>
          <div>Aloo</div>
          <button className="arth-buttons" onClick={() => handleDec("Aloo")}>
            -
          </button>
        </div>
        <div className="burger-item">
          <button
            className="arth-buttons"
            onClick={() => handleQuantity("inc")}
          >
            +
          </button>
          <div>Quantity: {quantity}</div>
          <button
            className="arth-buttons"
            onClick={() => handleQuantity("dec")}
          >
            -
          </button>
        </div>
      </div>
      <div className="burger-container">
        {itemStack.map((item) => (
          <div className={`burger-image ${item}`}>
            <div>{ingredients[item]}</div>
          </div>
        ))}
      </div>
      <div className="price">Total price : {totalPrice}</div>
      <div
        className="place-order"
        onClick={() => {
          setModal(true);
        }}
      >
        Place order
      </div>
    </div>
  );
};

export default App;
