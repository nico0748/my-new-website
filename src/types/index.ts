import React from 'react';

// SNSリンクの型
export interface SocialLink {
name: string;
url: string;
icon: React.ReactNode;
}

// プロフィールデータの型
export interface ProfileData {
name: string;
title: string;
bio: string;
imageUrl: string;
socialLinks: SocialLink[];
}

// 作品データの型
export interface Work {
id: number;
title: string;
imageUrl: string;
}

// RecordsとRecsで共通して使われるグリッドアイテムの型
export interface GridItem {
id: string;
name: string;
desc: string;
imageUrl: string;
}

// イベントデータの型
export interface EventItem {
id: number;
text: string;
imageUrl: string;
date: string;
}

// コンポーネントのProps型
export interface HeaderProps {
activeSection: string;
scrollToSection: (id: string) => void;
}

export interface WorksProps {
works: Work[];
handleWorkClick: (work: Work) => void;
}

export interface GridSectionProps {
id: string;
title: string;
items: GridItem[];
onItemClick: (id: string) => void;
}

export interface RecordsProps {
records: GridItem[];
handleRecordsClick: (id: string) => void;
}

export interface RecsProps {
recs: GridItem[];
handleRecsClick: (id: string) => void;
}

export interface EventsProps {
events: EventItem[];
}

export interface ContactProps {
handleContactSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// 共通コンポーネントの型定義
export interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface ViewToggleButtonProps {
  isCarouselView: boolean;
  onToggle: () => void;
  carouselLabel?: string;
  gridLabel?: string;
}

export interface CarouselNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalItems: number;
  prevLabel?: string;
  nextLabel?: string;
}

export interface ContentCardProps {
  imageUrl: string;
  title?: string;
  description?: string;
  date?: string;
  onClick?: () => void;
  className?: string;
  imageHeight?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

// Contact関連の型定義
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}