# Amazon DSP → Kargo Segment Vetting Tool

A comprehensive pre-sales vetting tool that demonstrates which Amazon DSP audience segments can be activated on Kargo's premium publisher inventory. This interactive dashboard eliminates last-minute troubleshooting during campaign trafficking by providing clear visibility into segment availability, technical limitations, and activation pathways.

## 🎯 Project Objectives

- **Pre-Sales Intelligence**: Clear documentation of what Amazon DSP segments CAN and CANNOT be activated on Kargo inventory
- **Technical Validation**: Real-time validation of segment compatibility with Kargo's ad-tag architecture
- **Performance Estimation**: Match rate expectations and cost projections for different segment types
- **Integration Mapping**: Visual representation of Amazon DSP → Kargo activation paths

## 🚀 Features

### Core Functionality
- **Interactive Segment Selector** with advanced filtering by category, compatibility, and search
- **Performance Calculator** with real-time projections and cost analysis
- **Technical Limitation Mapper** showing detailed restrictions and workarounds
- **Cost Comparison Visualizations** between Kargo and standard DSP paths

### Amazon DSP Segment Categories

#### ✅ AVAILABLE for Kargo Activation (60-85% match rates)
- **Amazon Retail Graph Segments**: Purchase behavior, browsing history, category interests
- **In-Market Segments**: 500+ categories with 75-95% match rates
- **Lifestyle & Interest Segments**: 80-95% match rates on third-party inventory
- **ASIN-Level Targeting**: Product viewers/purchasers with 70-85% match rates
- **Custom & Lookalike Audiences**: Full availability with 60-80% match rates
- **Demographic Targeting**: Age, gender, geographic segments
- **Third-Party Data Integration**: LiveRamp, TransUnion, Bombora B2B intent

#### ❌ RESTRICTED on Kargo Inventory (Amazon O&O Only)
- Direct Prime membership status targeting
- Specific Prime Video content viewer segments
- Alexa voice command data
- Detailed device usage patterns
- Amazon Business B2B segments (limited availability)

## 🛠 Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Charts**: Recharts for segment visualization
- **State Management**: React hooks for segment filtering
- **Deployment**: GitHub Pages via GitHub Actions

### Key Components
- `SegmentSelector`: Interactive segment browsing and selection
- `PerformanceCalculator`: Match rate and cost projections
- `TechnicalLimitationMapper`: Restriction analysis and alternatives
- Comprehensive Amazon DSP segment database with real industry data

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/[username]/amazon-dsp-kargo-selector.git
cd amazon-dsp-kargo-selector
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000` to see the application

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `docs` folder for GitHub Pages deployment.

## 🚀 Deployment

### GitHub Pages Deployment

1. **Push to main branch**
```bash
git add .
git commit -m "Deploy Amazon DSP Kargo Selector"
git push origin main
```

2. **Enable GitHub Pages**
- Go to repository Settings → Pages
- Set source to "GitHub Actions"
- The workflow will automatically deploy on push to main

3. **Access your live site**
Your tool will be available at: `https://[username].github.io/amazon-dsp-kargo-selector`

### Manual Deployment
```bash
npm run deploy
```

## 📊 Usage Guide

### Segment Selection Process
1. **Browse Available Segments**: Use filters to explore Amazon DSP categories
2. **Review Compatibility**: Green segments available, red segments restricted
3. **Check Technical Details**: Match rates, CPM estimates, setup requirements
4. **Select for Activation**: Build your segment portfolio

### Performance Analysis
1. **Set Campaign Budget**: Input total investment amount
2. **Review Projections**: Estimated impressions, reach, and costs
3. **Compare Platforms**: Kargo vs standard DSP performance
4. **Validate Timeline**: Setup requirements and launch schedule

## 🔧 Getting Started

To run this project locally:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

Built with Next.js 14, TypeScript, and Tailwind CSS for optimal performance and developer experience.