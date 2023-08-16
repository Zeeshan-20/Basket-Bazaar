import bcrypt from 'bcryptjs';
const data = {
    users: [
        {
            name: 'Zeeshan',
            email: 'admin@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        },
        {
            name: 'John',
            email: 'user@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,

        }
    ],
    products: [
        { //dimesnion of images is 679 * 829 
            //images from unsplash 
            // _id:'1',
            name: 'Potato',
            //what you see in url
            slug: 'Potato',
            category: 'Vegeatbles',
            image: "/images/potato.jpg",
            price: 50,
            countInStock: 0,
            rating: 4.6,
            numReviews: 1000,
            description: "Fresh",
        },
        {
            // _id:'2',
            name: 'Carrot',
            //what you see in url
            slug: 'Carrot',
            category: 'Vegeatbles',
            image: "/images/carrot.jpg",
            price: 60,
            countInStock: 10,
            rating: 10,
            numReviews: 1,
            description: "Fresh",
        },
        {
            // _id:'3',
            name: 'Ginger',
            //what you see in url
            slug: 'Ginger',
            category: 'Vegeatbles',
            image: "/images/ginger.jpg",
            price: 50,
            countInStock: 1000,
            rating: 4.6,
            numReviews: 10,
            description: "Fresh",
        },
        {
            // _id:'4',
            name: 'Onion',
            //what you see in url
            slug: 'Onion',
            category: 'Vegeatbles',
            image: "/images/onion.jpg",
            price: 20,
            countInStock: 1000,
            rating: 4.3,
            numReviews: 10,
            description: "Fresh",
        },
        // {
        //     _id:'5',
        //     name: 'Potato',
        //     what you see in url
        //     slug: 'Potato',
        //     category: 'Vegeatbles',
        //     image: "/images/potato.jpg",
        //     price: 20,
        //     countInStock: 1000,
        //     rating: 4.3,
        //     numReviews: 10,
        //     description: "Fresh",
        // },

    ],
};
export default data;