"use client"

import { Search, Bookmark, FolderKanban, Plus, ChevronDown, LayoutGrid } from "lucide-react"
import { useNotesStore } from "@/store/notes"
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSession, signIn, signOut } from 'next-auth/react';

import {
  // ChevronLeft,
  // ChevronRight,
  // Book,
  // MoreHorizontal,
  // Upload,
  // LinkIcon,
  // Maximize2,
  // Minimize2,
  // Trash2,
  FileText,
  // PlusCircle,
  // PaperclipIcon,
} from "lucide-react"
export function Header() {
  const { data: session, status } = useSession();

  const [creatingDoc, setCreatingDoc] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const { currentNote } = useNotesStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // const { signIn, signOut, user } = useAuth()
  // const { data: session, status } = useSession();


  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("access_token")
    if (token) {
      setAccessToken(token)
      // setIsSignedIn(true)
    }
  }, [])

  const handleNewNote = () => {
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: "Untitled " + Math.floor(Math.random() * 1000),
      content: "",
      type: "note" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    useNotesStore.getState().addNote(newNote)
    useNotesStore.getState().setCurrentNote(newNote)
  }
  // const { data: session } = useSession();
  const [createdDocs, setCreatedDocs] = useState<string[]>([]); // State to store document IDs

  const handleCreateGoogleDoc = async () => {
    console.log("Creating Google Doc...");

    const accessToken = session?.accessToken; // Get access token from session

    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    setCreatingDoc(true);
    try {
      const response = await fetch("/api/docs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: accessToken,
          title: currentNote?.title || "New Document", // Use current note title or default
          content: currentNote?.content || "", // Use current note content or empty
        }),
      });

      const doc = await response.json();
      console.log("Created document:", doc);

      if (doc.documentId) {
        console.log("Document created with ID:", doc.documentId);
        // Optionally, you can open the document in a new tab
        // window.open(`https://docs.google.com/document/d/${doc.documentId}`, "_blank");
      }
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setCreatingDoc(false);
    }
  };

  // const handleCreateGoogleDoc = async () => {
  //   console.log("Creating Google Doc...");

  //   const accessToken = session?.accessToken; // Get access token from session

  //   if (!accessToken) {
  //     console.error("No access token available");
  //     return;
  //   }

  //   setCreatingDoc(true);
  //   try {
  //     const response = await fetch("/api/docs/create", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ token: accessToken, title: "New Document" }),
  //     });

  //     const doc = await response.json();
  //     console.log("Created document:", doc);

  //     if (doc.documentId) {
  //       console.log("Document created with ID:", doc.documentId);
  //       // Store the document ID in state
  //       setCreatedDocs((prevDocs) => [...prevDocs, doc.documentId]);
  //     }
  //   } catch (error) {
  //     console.error("Error creating document:", error);
  //   } finally {
  //     setCreatingDoc(false);
  //   }
  // };
  // const handleCreateGoogleDoc = async () => {
  //   console.log("Creating Google Doc...");

  //   const accessToken = session?.accessToken; // Get access token from session

  //   if (!accessToken) {
  //     console.error("No access token available");
  //     return;
  //   }
  //   setCreatingDoc(true);
  //   try {
  //     const response = await fetch("/api/docs/create", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ token: accessToken, title: "New Document" }),
  //     });

  //     const doc = await response.json();
  //     console.log("Created document:", doc);

  //     if (doc.documentId) {
  //       window.open(`https://docs.google.com/document/d/${doc.documentId}`, "_blank");
  //     }
  //   } catch (error) {
  //     console.error("Error creating document:", error);
  //   } finally {
  //     setCreatingDoc(false);
  //   }
  // };

  // const handleGoogleSignIn = () => {
  //   signIn()
  // }

  // const handleSignOut = () => {
  //   signOut()
  // }


  // const handleCreateGoogleDoc = async () => {
  //   console.log("createeee",accessToken)
  //   if (accessToken) {
  //     try {
  //       const response = await fetch("/api/docs/create", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ token: accessToken, title: "New Document" }),
  //       })
  //       const doc = await response.json()
  //       console.log("Created document:", doc)
  //     } catch (error) {
  //       console.error("Error creating document:", error)
  //     }
  //   }
  // }

  return (
    <header className="flex h-12 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm">
          <FolderKanban size={18} />
        </button>
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm" onClick={toggleSearch}>
          <Search size={18} />
        </button>
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm">
          <Bookmark size={18} />
        </button>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-1 px-4 py-1 hover:bg-zinc-800 rounded-sm">
          <span>{currentNote?.title || "Untitled"}</span>
          <button className="p-0.5" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <ChevronDown size={16} />
          </button>
        </div>
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm" onClick={handleNewNote}>
          <Plus size={18} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {status === "authenticated" ? (
          <>
            <Button onClick={handleCreateGoogleDoc} disabled={creatingDoc}>
              <FileText className="mr-2 h-4 w-4" />
              {creatingDoc ? "Creating..." : "Create Google Doc"}
            </Button>
            <Button onClick={() => signOut()} variant="destructive">
              Sign Out
            </Button>
          </>
        ) : (
          <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        )}
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm">
          <LayoutGrid size={18} />
        </button>
      </div>
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-800 p-2">
          <input type="text" placeholder="Search..." className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded" />
        </div>
      )}
    </header>
  )
}

