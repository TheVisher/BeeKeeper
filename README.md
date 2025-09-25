# Capture Card Recall - Bookmarking App

A minimal, modern bookmarking application built with Next.js, Tailwind CSS, shadcn/ui, and Framer Motion.

## Local Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Run the development server:**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Core Loop

*   **Capture:** Add new items via the `/api/clip` endpoint or the "Add Card" dialog.
*   **Card:** View and interact with items as 3D flip cards.
*   **Recall:** Find items using the search bar and filters in the responsive grid.
