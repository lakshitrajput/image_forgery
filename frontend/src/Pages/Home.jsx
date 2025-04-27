import React from "react";
import Navbar from "../Components/Navbar";
import Banner from "../Components/Banner";
import Section from "../Components/Section";
import Footer from "../Components/Footer";

const Home = () => {
    return (
        <>
            <Navbar />

            <section id="home">
                <Banner />
            </section>

            <section id="feature">
                <Section />
            </section>

            <section id="about">
                <Footer />
            </section>
        </>
    )
}

export default Home;