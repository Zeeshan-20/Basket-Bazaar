import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';

function Slider() {
    return (
        //image is 2500*1500px
        <Carousel fade>
            <Carousel.Item interval={2300} >
                <img className='w-100 rounded' src="/images/slider/p1.jpg" alt="img1" />
                <Carousel.Caption>
                    <strong><h3 id="slidertext" >Freshly Harvested Delights</h3></strong>
                    <p id="sliderpara"> Discover the True Taste of Nature's Bounty.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2300} >
                <img className='w-100 rounded' src="/images/slider/p2.jpg" alt="img2" />
                <Carousel.Caption>
                    <h3 id="slidertext">Organic Greens at Their Finest</h3>
                    <p id="sliderpara">From Farm to Table, Wholesome and Nutrient-Rich.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2300} >
                <img className='w-100 rounded' src="/images/slider/p3.jpg" alt="img3" />
                <Carousel.Caption>
                    <h3 id="slidertext">Nurtured by Nature</h3>
                    <p id="sliderpara">Explore Our Range of Naturally Grown Organic Vegetables.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}


export default Slider;