import { Helmet } from 'react-helmet-async';
import { useSiteConfig } from '../../context/SiteConfigContext';

export default function Seo({ title, description, image, noindex }) {
  const { name } = useSiteConfig();
  const full = title ? `${title} | ${name}` : `${name} | Style for Everyday Life`;
  return (
    <Helmet>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  );
}
