import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Review = {
  id: number;
  user: string;
  rating: number; // 1-5
  text: string;
};

type Lawyer = {
  id: number;
  name: string;
  firm?: string;
  area?: string;
  verified: boolean;
  avatar?: string;
  reviews: Review[];
};

const MOCK_LAWYERS: Lawyer[] = [
  {
    id: 1,
    name: "Md. Rahim Ahmed",
    firm: "Rahim & Associates",
    area: "Senior Advocate",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    reviews: [
      { id: 1, user: "Sarah Johnson", rating: 5, text: "Rahim helped me through my divorce with compassion and expertise. Highly recommended." },
      { id: 101, user: "Ahmed Ali", rating: 4, text: "Professional and thorough. Made a difficult process much easier." },
    ],
  },
  {
    id: 2,
    name: "Adv. Fatima Noor",
    firm: "Noor Legal Consultants",
    area: "Legal Consultant",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    reviews: [
      { id: 2, user: "Michael Chen", rating: 5, text: "Fatima's expertise in human rights law saved my case. Exceptional lawyer." },
      { id: 102, user: "Priya Patel", rating: 5, text: "Compassionate and knowledgeable. Highly recommended for legal matters." },
    ],
  },
  {
    id: 3,
    name: "Adv. Samina Hossain",
    firm: "Hossain Law Firm",
    area: "Principal Advocate",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    reviews: [
      { id: 4, user: "David Williams", rating: 5, text: "Samina provided excellent counsel on my intellectual property case. Thorough and professional." },
      { id: 104, user: "Lisa Rodriguez", rating: 4, text: "Great understanding of complex legal matters. Very satisfied with the service." },
    ],
  },
  {
    id: 4,
    name: "Md. Farhad Karim",
    firm: "Karim Legal Partnership",
    area: "Senior Partner",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=400&h=400&fit=crop",
    reviews: [
      { id: 5, user: "Emma Thompson", rating: 5, text: "Farhad successfully represented me in a challenging labor dispute. Highly skilled advocate." },
      { id: 105, user: "Carlos Martinez", rating: 5, text: "Outstanding legal representation. Won my case with strategic brilliance." },
    ],
  },
  {
    id: 5,
    name: "Adv. Rina Khan",
    firm: "Khan Immigration Services",
    area: "Immigration Specialist",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    reviews: [
      { id: 8, user: "Maria Garcia", rating: 5, text: "Rina guided me through the complex immigration process with patience and expertise. Truly grateful." },
    ],
  },
  {
    id: 6,
    name: "Dr. Nasir Uddin",
    firm: "Uddin Tax Advisors",
    area: "Tax Law Specialist",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    reviews: [
      { id: 7, user: "Jennifer Brown", rating: 4, text: "Nasir provided valuable tax advice that saved me thousands. Very knowledgeable." },
      { id: 107, user: "Robert Lee", rating: 5, text: "Excellent tax consultation services. Clear explanations and practical solutions." },
    ],
  },
];

export function SponsorshipPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>(MOCK_LAWYERS);
  const [selected, setSelected] = useState<Lawyer | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(5);
  const isMobile = useIsMobile();

  const hireLawyer = (id: number) => {
    // Placeholder - in real app would navigate to booking/contact form
    alert("Contact form would open here to book a consultation with the lawyer.");
  };

  const openReviews = (l: Lawyer) => {
    setSelected(l);
    setShowReviewForm(false);
    setReviewText("");
    setRating(5);
  };

  const addReview = () => {
    if (!selected) return;
    const newReview = {
      id: Date.now(),
      user: "Anonymous",
      rating,
      text: reviewText || "(no comment)",
    };
    setLawyers((prev) =>
      prev.map((l) =>
        l.id === selected.id ? { ...l, reviews: [newReview, ...l.reviews] } : l
      )
    );
    setSelected((s) => (s ? { ...s, reviews: [newReview, ...s.reviews] } : s));
    setShowReviewForm(false);
    setReviewText("");
    setRating(5);
  };

  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round(sum / reviews.length);
  };

  const renderStars = (rating: number) => {
    return '★★★★★'.split('').map((star, index) =>
      <span key={index} className={index < rating ? "text-yellow-400" : "text-gray-600"}>
        {star}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Find Bangladesh's Top Lawyers</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with verified legal professionals in Bangladesh.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={lawyer.avatar}
                alt={lawyer.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-1">{lawyer.name}</h3>
                <p className="text-muted-foreground mb-1">{lawyer.area}</p>
                <p className="text-sm text-muted-foreground/70 mb-4">{lawyer.firm}</p>

                <div className="flex items-center justify-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-200">
                    ✓ Verified Professional
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => hireLawyer(lawyer.id)}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors bg-yellow-600 hover:bg-yellow-500 text-gray-900"
                  >
                    Book Consultation
                  </button>

                  <button
                    onClick={() => openReviews(lawyer)}
                    className="w-full py-3 px-4 rounded-lg font-medium border-2 border-yellow-600 hover:bg-yellow-600 hover:text-gray-900 transition-colors text-yellow-400 flex items-center justify-center gap-2"
                  >
                    <span className="flex items-center">
                      {renderStars(getAverageRating(lawyer.reviews))}
                    </span>
                    <span>({lawyer.reviews.length})</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Reviews Modal */}
        {selected && !isMobile && (
          <aside className="fixed right-6 top-24 w-96 bg-card border border-border rounded-xl shadow-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selected.firm} · {selected.area}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-destructive"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 max-h-48 overflow-auto pr-2">
              {selected.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No reviews yet. Be the first to review.
                </p>
              ) : (
                selected.reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border-t border-border pt-3 mt-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-foreground">{r.user}</div>
                      <div className="text-xs">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setShowReviewForm((s) => !s)}
                className="w-full py-2 rounded-md bg-yellow-600 text-gray-900 font-medium hover:bg-yellow-500"
              >
                Leave a Review
              </button>

              {showReviewForm && (
                <div className="mt-3">
                  <label className="block text-xs text-muted-foreground">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full mt-1 mb-2 rounded bg-input p-2 text-foreground border border-input focus:border-ring"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Okay</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>

                  <label className="block text-xs text-muted-foreground">
                    Your review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full mt-1 rounded bg-input border border-input p-2 text-foreground focus:border-ring"
                    rows={3}
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={addReview}
                      className="flex-1 py-2 rounded-md bg-yellow-600 text-gray-900 font-medium hover:bg-yellow-500"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="flex-1 py-2 rounded-md border border-yellow-600 hover:bg-yellow-600 hover:text-gray-900 text-yellow-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Mobile Reviews Dialog */}
        {selected && isMobile && (
          <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
            <DialogContent className="w-[95vw] max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">{selected.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {selected.firm} · {selected.area}
                </p>
              </DialogHeader>

              <div className="mt-3 max-h-48 overflow-auto pr-2">
                {selected.reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to review.
                  </p>
                ) : (
                  selected.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border-t border-border pt-3 mt-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-foreground">{r.user}</div>
                        <div className="text-xs">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{r.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setShowReviewForm((s) => !s)}
                  className="w-full py-2 rounded-md bg-yellow-600 text-gray-900 font-medium hover:bg-yellow-500"
                >
                  Leave a Review
                </button>

                {showReviewForm && (
                  <div className="mt-3">
                    <label className="block text-xs text-muted-foreground">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full mt-1 mb-2 rounded bg-input p-2 text-foreground border border-input focus:border-ring"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Okay</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>

                    <label className="block text-xs text-muted-foreground">
                      Your review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full mt-1 rounded bg-input border border-input p-2 text-foreground focus:border-ring"
                      rows={3}
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={addReview}
                        className="flex-1 py-2 rounded-md bg-yellow-600 text-gray-900 font-medium hover:bg-yellow-500"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="flex-1 py-2 rounded-md border border-yellow-600 hover:bg-yellow-600 hover:text-gray-900 text-yellow-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Legal Disclaimer */}
        <footer className="mt-10 text-xs text-yellow-300 text-center">
          © {new Date().getFullYear()} LEGAL BEE — Sponsor to support verified
          lawyers.
          <div className="mt-2 text-yellow-500">
            Legal Disclaimer: LEGAL BEE is an AI legal assistant that provides
            general information. It is not a substitute for professional legal
            advice from a qualified lawyer.
          </div>
        </footer>
      </main>
    </div>
  );
}

export default SponsorshipPage;
