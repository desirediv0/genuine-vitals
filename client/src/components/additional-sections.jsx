"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Quote,
  Play,
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Zap,
  Target,
  TrendingUp,
  Heart,
  Shield,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// 1. Customer Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Fitness Enthusiast",
      image: "/placeholder.png",
      rating: 5,
      text: "Genuine Vitals ne meri fitness journey ko completely transform kar diya! 3 months mein 8kg muscle gain kiya hai.",
      location: "Mumbai",
      verified: true,
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "Professional Athlete",
      image: "/placeholder.png",
      rating: 5,
      text: "Best quality supplements with amazing results. Lab tested products pe full trust hai!",
      location: "Delhi",
      verified: true,
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Gym Trainer",
      image: "/placeholder.png",
      rating: 5,
      text: "Meri gym ke sabhi members ko recommend karta hun. Quality aur price dono perfect hai!",
      location: "Bangalore",
      verified: true,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Users className="h-4 w-4 mr-2" />
            50,000+ Happy Customers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Real Results, Real Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover how our premium supplements have transformed thousands of
            fitness journeys
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 group">
                <CardContent className="p-8 relative">
                  <div className="absolute top-4 right-4 text-primary/20 group-hover:text-primary/40 transition-colors">
                    <Quote className="h-8 w-8" />
                  </div>

                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <Image
                        src={testimonial.image || "/placeholder.png"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full border-4 border-primary/20"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <Link href="/reviews">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-transparent"
            >
              View All Reviews
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div> */}
      </div>
    </section>
  );
};

// 2. Brand Story/Mission Section
const BrandStorySection = () => {
  const achievements = [
    {
      number: "50K+",
      label: "Happy Customers",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "100+",
      label: "Premium Products",
      icon: <Award className="h-6 w-6" />,
    },
    {
      number: "5 Years",
      label: "Trust & Quality",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      number: "24/7",
      label: "Expert Support",
      icon: <Clock className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
                Our Mission
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Empowering Your
                <span className="text-primary block">Fitness Journey</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At Genuine Vitals, we believe that everyone deserves access to
                premium quality supplements that deliver real results. Our
                mission is to provide scientifically-backed, lab-tested products
                that help you achieve your fitness goals safely and effectively.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From sourcing the finest ingredients to rigorous quality
                testing, every step of our process is designed with your health
                and success in mind.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <div className="text-primary mb-2 flex justify-center">
                    {achievement.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {achievement.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Genuine Vitals Story"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>

              {/* Floating Elements */}
              <div className="absolute top-8 right-8 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Lab Tested
                    </div>
                    <div className="text-sm text-gray-600">100% Pure</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Premium Quality
                    </div>
                    <div className="text-sm text-gray-600">Trusted by 50K+</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// 3. Special Offers/Deals Section
const SpecialOffersSection = () => {
  const offers = [
    {
      id: 1,
      title: "First Order Special",
      discount: "25% OFF",
      description: "Get 25% off on your first order above ₹999",
      code: "FIRST25",
      validTill: "Limited Time",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
      icon: <Zap className="h-8 w-8" />,
    },
    {
      id: 2,
      title: "Bulk Purchase Deal",
      discount: "Buy 2 Get 1",
      description: "Buy any 2 products and get 1 absolutely free",
      code: "BULK3",
      validTill: "This Month Only",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: <Target className="h-8 w-8" />,
    },
    {
      id: 3,
      title: "Premium Member",
      discount: "Extra 15% OFF",
      description: "Join our premium membership for exclusive discounts",
      code: "PREMIUM15",
      validTill: "Ongoing",
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
      icon: <Award className="h-8 w-8" />,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Limited Time Offers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Exclusive Deals & Offers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Don&apos;t miss out on these amazing deals to boost your fitness
            journey
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 group overflow-hidden">
                <div
                  className={`${offer.bgColor} p-6 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-white/80">{offer.icon}</div>
                      <Badge className="bg-white/20 text-white hover:bg-white/30">
                        {offer.validTill}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <div className="text-3xl font-bold mb-2">
                      {offer.discount}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Coupon Code
                    </div>
                    <div className="font-mono font-bold text-primary text-lg">
                      {offer.code}
                    </div>
                  </div>

                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Claim Offer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. Video Testimonial Section
const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-white to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Watch Real Transformations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our customers achieved their fitness goals with Genuine
              Vitals supplements
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            <Image
              src="/protein-gym.jpg"
              alt="Customer Transformation Video"
              width={700}
              height={400}
              className="w-full group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Play className="h-8 w-8 text-primary ml-1" />
              </div>
            </div>

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold mb-2">
                Alina&apos;s 90-Day Transformation
              </h3>
              <p className="text-white/80">
                From 65kg to 55kg with lean muscle gain
              </p>
            </div>
          </motion.div>

          {/* <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                View More Stories
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-transparent"
                >
                Share Your Story
                <Heart className="ml-2 h-5 w-5" />
                </Button>
            </div> */}
        </div>
      </div>
    </section>
  );
};

export {
  TestimonialsSection,
  BrandStorySection,
  SpecialOffersSection,
  VideoSection,
};
