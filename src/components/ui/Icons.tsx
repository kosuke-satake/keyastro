import type { SVGProps } from 'react';
import { 
  FaInstagram, 
  FaFacebook, 
  FaLinkedin, 
  FaTwitter, 
  FaLine, 
  FaDiscord, 
  FaSlack, 
  FaGithub, 
  FaYoutube, 
  FaEnvelope, 
  FaLink, 
  FaGlobe,
  FaCopy,
  FaCheck
} from 'react-icons/fa6';

const IconMap: Record<string, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  line: FaLine,
  discord: FaDiscord,
  slack: FaSlack,
  github: FaGithub,
  youtube: FaYoutube,
  email: FaEnvelope,
  link: FaLink,
  globe: FaGlobe,
  copy: FaCopy,
  check: FaCheck
};

interface SocialIconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export function SocialIcon({ name, ...props }: SocialIconProps) {
  const iconName = name.toLowerCase();
  const IconComponent = IconMap[iconName] || FaLink;

  return <IconComponent {...props} />;
}