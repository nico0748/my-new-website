
export interface HeaderProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
};

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode; // SVGやJSX要素など、Reactが描画できるものすべてを表す型
}

export interface ProfileData{
  imageUrl: string;
  name: string;
  title: string;
  bio: string;
  socialLinks: SocialLink[]; // SocialLink型のオブジェクトが複数入る配列  
}

export interface ProfileProps{
    data: ProfileData;
}

export interface Work {
    id: number;
    title: string;
    imageUrl: string;
}

export interface WorksProps{
    works: Work[];
    handleWorkClick: (work: Work) => void; // Work型のオブジェクトを引数に取り、何も返さない関数
} 

export interface GridItem {
    id: string;
    name: string;
    desc: string;
    imageUrl: string;
}

export interface RecordsProps{
    records: GridItem[];
    handleRecordClick: (id: string) => void;
}

export interface GridSectionProps{
    id: string;
    title: string;
    items: GridItem[];
    onItemClick: (id: string) => void;
}

export interface GridItem {
    id: string;
    name: string;
    desc: string;
    imageUrl: string;
}

export interface RecsProps{
    recs: GridItem[];
    handleRecsClick: (id: string) => void;
}

export interface GridSectionProps{
  id: string;
  title: string;
  items: GridItem[];
  onItemClick: (id: string) => void;
}

export interface EventItem{
  id: number;
  imageUrl: string;
  date: string;
  text: string;
}

export interface EventsProps {
  events: EventItem[]; // EventItem型のオブジェクトが複数入る配列
}

export interface ContactProps{
    handleContactSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}