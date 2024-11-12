import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export function GoogleReviews() {
  const [reviews, setReviews] = useState<Exclude<google.maps.places.PlaceResult['reviews'], undefined>>([]);
  const center = { lat: 59.920347151202975, lng: 10.734426811873956 };
  const mapId = 'bd713334a2dc72c';

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_KEY,
      version: 'weekly',
    });

    async function fetchReviews() {
      try {
        await loader.importLibrary('places');
        const map = new google.maps.Map(document.createElement('div'), {
          center,
          zoom: 15,
          mapId,
        });

        const service = new google.maps.places.PlacesService(map);

        console.log(service);
        const request = {
          placeId: 'ChIJF2VNQ3luQUYRVL7Kva75zTY',
          fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'reviews'],
        };

        service.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(place);
            setReviews(place?.reviews || []);
          } else {
            console.error('Error fetching reviews:', status);
          }
        });
      } catch (error) {
        console.error('Error loading Google Places:', error);
      }
    }

    fetchReviews();
  }, []);

  return (
    <div>
      <h2>Google Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review">
            <p>
              <strong>{review.author_name}</strong>
            </p>
            <p>Rating: {review.rating}</p>
            <p>{review.text}</p>
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
}
