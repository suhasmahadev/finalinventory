import React from 'react';
import { ScrollText, UserCheck, AlertOctagon, Scale, RefreshCw } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-brown-900 mb-4">Terms of Service</h1>
                <p className="text-brown-600 text-lg">Terms and conditions governing your use of AIVENTORY.</p>
            </div>

            <div className="space-y-8 glass-panel p-8 rounded-2xl border border-beige-200">
                <Section
                    icon={ScrollText}
                    title="1. Acceptance of Terms"
                    content="By accessing or using the AIVENTORY platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
                />

                <Section
                    icon={UserCheck}
                    title="2. User Responsibilities"
                    content="You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password."
                />

                <Section
                    icon={AlertOctagon}
                    title="3. Limitation of Liability"
                    content="In no event shall AIVENTORY or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AIVENTORY's website."
                />

                <Section
                    icon={Scale}
                    title="4. Governing Law"
                    content="These terms and conditions are governed by and construed in accordance with the laws of the State of Delaware and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location."
                />

                <Section
                    icon={RefreshCw}
                    title="5. Changes to Terms"
                    content="We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect."
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

export default TermsPage;
