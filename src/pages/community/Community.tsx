import AnnouncementBar from '../../components/announcement-bar/AnnouncementBar';
import SiteFooter from '../../components/site/SiteFooter';
import SiteHeader from '../../components/site/SiteHeader';
import SiteMeta from '../../components/site/SiteMeta';
import SitePreFooter from '../../components/site/SitePreFooter';
import Col from '../../components/ui/Col';
import Grid from '../../components/ui/Grid';
import ResponsiveContainer from '../../components/ui/ResponsiveContainer';
import { PrismicResponsiveImage, PrismicRichText } from '../../prismic';
import CommunityStyles from './Community.styles';

const CommunityPage = (data) => {
  return (
    <>
      <AnnouncementBar {...data.announcement_bar} />
      <CommunityStyles>
        <SiteMeta title="Community" description="Get connected with the Capacitor developer community" />
        <SiteHeader />
        <Top {...data} />
        <Websites {...data} />
        <ResponsiveContainer id="newsletter" as="section">
          {/*
          <newsletter-signup />
          */}
        </ResponsiveContainer>
        <SitePreFooter />
        <SiteFooter />
      </CommunityStyles>
    </>
  );
};

const Top = ({ top, top__list }) => {
  return (
    <ResponsiveContainer id="top" as="section">
      <div className="heading-group">
        <PrismicRichText render={top} paragraphLevel={2} />
      </div>
      <div className="cards">
        {top__list.map(({ image, text, link: { target, url } }) => (
          <a target={target} href={url} className="card" key={url}>
            <div className="image-wrapper">
              <PrismicResponsiveImage image={image} />
            </div>
            <PrismicRichText render={text} />
          </a>
        ))}
      </div>
    </ResponsiveContainer>
  );
};

const Websites = ({ websites__list }) => {
  const dimensions = ['40x32', '40x34', '34x40', '40x40'];

  return (
    <ResponsiveContainer id="websites" as="section">
      <Grid>
        {websites__list.map(({ icon, text, link }, i) => {
          const [width, height] = dimensions[i].split('x');

          return (
            <Col cols={12} xs={6} md={3} key={i}>
              <div className="image-wrapper">
                <PrismicResponsiveImage width={width} height={height} image={icon} />
              </div>
              <PrismicRichText render={text} />
              <PrismicRichText className="link" render={link} />
            </Col>
          );
        })}
      </Grid>
    </ResponsiveContainer>
  );
};

export default CommunityPage;
