import React from 'react';
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';

const PrivacyPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-brown-900 mb-4">Privacy Policy</h1>
                <p className="text-brown-600 text-lg">Transparent data handling for your inventory intelligence.</p>
            </div>

            <div className="space-y-8 glass-panel p-8 rounded-2xl border border-beige-200">
                <Section
                    icon={Shield}
                    title="1. Introduction"
                    content="AIVENTORY ('we', 'us', or 'our') respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our inventory management platform and tell you about your privacy rights and how the law protects you."
                />

                <Section
                    icon={Eye}
                    title="2. Data We Collect"
                    content="We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows: Identity Data (username, roles), Contact Data (email, billing address), Financial Data (payment details), and Usage Data (how you use our platform and inventory services)."
                />

                <Section
                    icon={FileText}
                    title="3. How We Use Your Data"
                    content="We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: To register you as a new customer, to process and deliver your order, to manage our relationship with you, and to use data analytics to improve our website, products/services, marketing, customer relationships and experiences."
                />

                <Section
                    icon={Lock}
                    title="4. Data Security"
                    content="We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know."
                />

                <Section
                    icon={Mail}
                    title="5. Contact Us"
                    content="If you have any questions about this privacy policy or our privacy practices, please contact our data privacy manager at privacy@aiventory.com."
                />
            </div>

            <div className="mt-12 pt-8 border-t border-beige-200 text-center text-brown-400 text-sm">
                <p>Version 2.4.0 • Last Updated: February 14, 2026</p>
                <p>&copy; 2026 AIVENTORY Inc. All rights reserved.</p>
            </div>
        </div>
    );
};

const Section = ({ icon: Icon, title, content }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-beige-100 flex items-center justify-center text-brown-600">
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div>
            <h2 className="text-xl font-bold text-brown-900 mb-2">{title}</h2>
            <p className="text-brown-600 leading-relaxed">{content}</p>
        </div>
    </div>
);

export default PrivacyPage;
