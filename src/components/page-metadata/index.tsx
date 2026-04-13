const APP_NAME = 'Todo Dynamic Form';

interface PageMetadataProps {
  title?: string;
}

const PageMetadata = ({ title }: PageMetadataProps) => {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  return <title>{fullTitle}</title>;
};

export default PageMetadata;
