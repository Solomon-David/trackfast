<template>
  <v-container class="py-10 ">
  <section>
    <!-- Header Section -->
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="text-h4 font-weight-bold mb-4">About TrackFast</h1>
        <p class="text-body-1">
          TrackFast is a modern logistics and shipment tracking platform designed to make
          deliveries transparent, fast, and stress-free. Whether you're a regular
          customer, a staff member handling operations, or an administrator overseeing
          performance, TrackFast provides a seamless experience for everyone.
        </p>
      </v-col>
    </v-row>

    <!-- Mission Section -->
    <v-row justify="center" class="my-10">
      <v-col cols="12" md="10" class="text-center">
        <h2 class="text-h5 font-weight-bold mb-3">Our Mission</h2>
        <v-row justify="center" class="mt-5 mb-8">
          <v-col cols="12" md="8">
            <v-img
              src="/src/assets/deliveryandclient.jpg"
              alt="Image by Freepik"
              width="600"
              cover
              class="rounded-lg elevation-2"
            />
          </v-col>
        </v-row>
        <p class="text-body-1 mb-4">
          Our mission is to revolutionize the logistics experience by delivering fast,
          transparent, and highly reliable shipment tracking. We aim to eliminate
          uncertainty for customers by offering real-time updates, seamless communication,
          and intuitive tools that make tracking packages simple and stress-free from
          start to finish.
        </p>

         <p class="text-body-1 mb-4">
          Our mission is simple: **to redefine parcel tracking with accuracy and
          reliability**. Too often, customers are left in the dark about where their
          packages are and when they will arrive. TrackFast changes that by offering
          instant shipment status updates, transparent communication, and an intuitive
          user dashboard that puts all your shipment data at your fingertips.
        </p>
        
        <p class="text-body-1 mb-4">
          Security is also a core part of our design philosophy. All user accounts are
          protected by secure authentication and verification flows, while sensitive
          operations such as shipment updates and role-based access are tightly
          controlled. Every interaction within the platform is optimized for
          confidentiality, integrity, and availability.
        </p>
      </v-col>
    </v-row>

    <!-- Vision Section -->
    <v-row justify="center" class="my-10">
      <v-col cols="12" md="10" class="text-center">
        <h2 class="text-h5 font-weight-bold mb-3">Our Vision</h2>

        <!-- First Graphic -->
        <v-row justify="center" class="mt-5 mb-8">
          <v-col cols="12" md="8">
            <v-img
              src="/src/assets/delivery.jpg"
              alt="Image by Freepik"
              width="600"
              cover
              class="rounded-xl elevation-2"
            />
          </v-col>
        </v-row>
        
      </v-col>
    </v-row>

    <!-- Paragraph Section -->
    <v-row justify="center">
      <v-col cols="12" md="10">
        <p class="text-body-1 mb-4">
          Our vision is to become the most trusted digital logistics ecosystem, where
          every delivery is predictable, every update is accurate, and every
          user—customer, staff, or administrator—benefits from a smarter, more connected
          tracking experience. We envision a future where logistics is seamless,
          automated, and globally accessible.
        </p>

        <p class="text-body-1 mb-4">
          Beyond customer convenience, TrackFast also empowers logistics staff with tools
          to manage pickups, update shipment statuses, and monitor delivery progress with
          ease. Automated workflows reduce operational errors, while real-time
          notifications keep everyone informed and aligned.
        </p>

        <p class="text-body-1 mb-4">
          Administrators benefit from a robust backend system designed for managing users,
          monitoring staff activity, and analyzing performance metrics. With built-in
          staff management tools, activity logs, and reliable authentication, TrackFast
          brings enterprise-level oversight to logistics operations of any scale.
        </p>

        <p class="text-body-1 mb-4">
          At the heart of TrackFast is a commitment to user-centered design. We
          continually refine the experience—from faster navigation, cleaner dashboards,
          improved mobile responsiveness, and well-structured workflows—to ensure that
          every user, regardless of their role, enjoys a smooth, intuitive, and powerful
          logistics interface.
        </p>
      </v-col>
    </v-row>
    </section>
  </v-container>
</template>

<script setup></script>

<style scoped>
p {
  line-height: 1.7;
}
</style>
