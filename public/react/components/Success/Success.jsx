import { useEffect, useState } from "react"
import apiURL from "../../api"
import { useParams, useNavigate } from "react-router"

export default function Success() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const navigate = useNavigate()

  const getOrder = async () => {
    const response = await fetch(`${apiURL}/orders/${id}`)
    const order = await response.json()

    setOrder(order)
  }

  useEffect(() => {
    getOrder()
  }, [])

  return (
    <>
 <section className="max-w-6xl h-full mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 flex mt-4 justify-center items-center">
        <div className="p-6 flex flex-col justify-around flex-wrap outline gap-y-8">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Thank you for your purchase!
            </h2>

            <p>Your order number is: {order && order.id}</p>
            <p>Your order has been placed!</p>
          </div>
          <div className="mt-4 flex flex-col">
            {order &&
              order.items.map((item) => (
                <div key={item.id} className="grid grid-cols-3 w-full mb-8">
                  <img src={item.image} alt="item-image" width={60} height={60}  />
                  <div className="flex flex-col col-span-2 gap-2">
                    <p>{item.name}</p>
                    <p className="self-end">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
            <div className="grid w-full">
              <p>
                Your order status is:
                <span className="float-right">{order && order.status}</span>
              </p>
              <p>
                Your subtotal is:{" "}
                <span className="float-right">
                  ${order && (order.total * 0.93).toFixed(2)}
                </span>
              </p>
              <p>
                Your tax total is:
                <span className="float-right">
                  ${order && (order.total * 0.07).toFixed(2)}
                </span>
              </p>
              <p>
                Your order total is:
                <span className="float-right">
                  ${order && order.total.toFixed(2)}
                </span>
              </p>
            
          </div>
        </div>
      </section>
      <div className="w-full" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          type="button"
          onClick={() => navigate("/")}
        >
          Back to Shop
        </button>
      </div>
    </>
  )
}