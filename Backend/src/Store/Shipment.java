package Store;
import java.util.UUID;

public class Shipment implements Notify {

    private final String shipmentID;
    private final Order orderToShip;
    public Shipment(Order order) {
        this.orderToShip = order;
        this.shipmentID = UUID.randomUUID().toString();
        send(orderToShip.getCustomerInfo());
        orderToShip.setTrackingId(shipmentID);
    }

    public void updateOrderStatus() {
        orderToShip.setStatus( "IN_TRANSIT");  // stub
    }

    public void send(Object reciever) {
            if (reciever instanceof CustomerInfo) {
                updateOrderStatus();
                String email = ((CustomerInfo) reciever).email();
                /*
                    logic to send shipment info
                */
            }

            System.out.println("shipping order");
        }
    }