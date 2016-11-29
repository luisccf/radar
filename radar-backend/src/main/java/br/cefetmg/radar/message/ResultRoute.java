package br.cefetmg.radar.message;

import br.cefetmg.radar.entity.Location;
import java.util.List;

public class ResultRoute {
    private List <Location> route;
    private int numincidents;

    public List<Location> getRoute() {
        return route;
    }

    public void setRoute(List<Location> route) {
        this.route = route;
    }

    public int getNumincidents() {
        return numincidents;
    }

    public void setNumincidents(int numincidents) {
        this.numincidents = numincidents;
    }
    
}
