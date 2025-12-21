import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    schema?: string; // JSON-LD string
}

const SEO: React.FC<SEOProps> = ({ title, description, canonical, schema }) => {
    useEffect(() => {
        const baseTitle = 'Duckworth–Lewis–Stern (DLS) Calculator';
        const fullTitle = title ? `${title} – ${baseTitle}` : baseTitle;
        document.title = fullTitle;

        if (description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
        }

        if (canonical) {
            let linkCanonical = document.querySelector('link[rel="canonical"]');
            if (!linkCanonical) {
                linkCanonical = document.createElement('link');
                linkCanonical.setAttribute('rel', 'canonical');
                document.head.appendChild(linkCanonical);
            }
            linkCanonical.setAttribute('href', canonical);
        }

        // Handle JSON-LD Schema
        const existingSchema = document.getElementById('json-ld-schema');
        if (existingSchema) {
            existingSchema.remove();
        }

        if (schema) {
            const script = document.createElement('script');
            script.id = 'json-ld-schema';
            script.type = 'application/ld+json';
            script.innerHTML = schema;
            document.head.appendChild(script);
        }
    }, [title, description, canonical, schema]);

    return null;
};

export default SEO;
