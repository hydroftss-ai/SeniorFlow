import { useState } from 'react';
import {
  Music,
  Calendar,
  Play,
  Plus,
  Search,
  Pencil,
  Trash2,
  Monitor,
  Palette,
  ChevronDown,
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  author: string;
  lyrics: string;
}

interface ServiceItem {
  id: string;
  type: 'song' | 'bible' | 'welcome' | 'video' | 'announcement';
  title: string;
  content: string;
  refId?: string;
}

interface Meeting {
  id: string;
  title: string;
  createdAt: number;
  items: ServiceItem[];
}

interface ZocaloSettings {
  backgroundColor: string;
  textColor: string;
  opacity: number;
  height: number;
  showLogo: boolean;
  showChurchName: boolean;
  showDynamicTitle: boolean;
}

const initialSongs: Song[] = [
  {
    id: 's1',
    title: 'Grande eres tu',
    author: 'Chris Tomlin (version en espanol)',
    lyrics: `[Estrofa 1]
Grande eres tu, Senor
Y digno de alabar
El universo entero
Te adora sin cesar

[Coro]
Grande eres tu
Grande eres tu
Cielos y tierra
Te glorifican

[Estrofa 2]
Tuyo es el reino
Y el poder y la gloria
Por siempre y para siempre
Amen`,
  },
  {
    id: 's2',
    title: 'Cuan grande es tu bondad',
    author: 'Marcos Witt',
    lyrics: `[Estrofa 1]
Cuan grande es tu bondad
Oh Dios, cuan grande es
Tu misericordia
Es nueva cada dia

[Coro]
Grande es tu fidelidad
Grande es tu fidelidad
Cada manana
Son nuevas tus misericordias`,
  },
  {
    id: 's3',
    title: 'Jesus en tu presencia',
    author: 'Hillsong (version espanol)',
    lyrics: `[Estrofa]
Jesus, en tu presencia
Me postro a adorar
Mi corazon se rinde
Ante tu majestad

[Coro]
Santo, santo, santo
Dios todopoderoso
Quien fue, quien es
Y quien vendra`,
  },
  {
    id: 's4',
    title: 'El amor de Dios',
    author: 'Tradicional',
    lyrics: `[Estrofa 1]
El amor de Dios es maravilloso
El amor de Dios es maravilloso
El amor de Dios es maravilloso
Que grande es el amor de Dios!`,
  },
];

const initialZocalo: ZocaloSettings = {
  backgroundColor: '#1e293b',
  textColor: '#f8fafc',
  opacity: 0.95,
  height: 72,
  showLogo: true,
  showChurchName: true,
  showDynamicTitle: true,
};

function App() {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [currentPreviewItem, setCurrentPreviewItem] = useState<ServiceItem | null>(null);
  const [activeTab, setActiveTab] = useState<'songs' | 'planner' | 'zocalo'>('songs');
  const [zocalo, setZocalo] = useState<ZocaloSettings>(initialZocalo);
  const [churchName] = useState('Iglesia del Rey');
  const [isProjectionFullscreen, setIsProjectionFullscreen] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', author: '', lyrics: '' });
  const [showAddSong, setShowAddSong] = useState(false);
  const [songSearch, setSongSearch] = useState('');
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: 'meeting-1', title: 'Nueva reunión', createdAt: Date.now(), items: [] },
  ]);
  const [currentMeetingId, setCurrentMeetingId] = useState('meeting-1');
  const [showMenu, setShowMenu] = useState(false);
  const [showSongPicker, setShowSongPicker] = useState(false);
  const [showBiblePicker, setShowBiblePicker] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showMeetingCreator, setShowMeetingCreator] = useState(false);
  const [agendaType, setAgendaType] = useState<ServiceItem['type'] | null>(null);
  const [agendaDraft, setAgendaDraft] = useState({
    title: '',
    content: '',
  });
  const [meetingDraftTitle, setMeetingDraftTitle] = useState('');
  const [songPickerSearch, setSongPickerSearch] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [bibleDraft, setBibleDraft] = useState({
    title: '',
    passages: '',
  });

  const currentMeeting = meetings.find((meeting) => meeting.id === currentMeetingId) ?? meetings[0];
  const currentMeetingTitle = currentMeeting?.title ?? 'Reunión';

  const getDynamicTitle = () => {
    if (!currentPreviewItem) return 'Bienvenidos a la reunion';
    return currentPreviewItem.title;
  };

  const addSong = () => {
    if (!newSong.title.trim() || !newSong.lyrics.trim()) return;

    const songId = editingSongId ?? `s${Date.now()}`;
    const song: Song = {
      id: songId,
      title: newSong.title.trim(),
      author: newSong.author.trim() || 'Sin autor',
      lyrics: newSong.lyrics.trim(),
    };

    setSongs((currentSongs) =>
      editingSongId
        ? currentSongs.map((currentSong) => (currentSong.id === editingSongId ? song : currentSong))
        : [...currentSongs, song],
    );
    setNewSong({ title: '', author: '', lyrics: '' });
    setEditingSongId(null);
    setShowAddSong(false);
  };

  const startCreateSong = () => {
    setNewSong({ title: '', author: '', lyrics: '' });
    setEditingSongId(null);
    setShowAddSong(true);
  };

  const startEditSong = (song: Song) => {
    setEditingSongId(song.id);
    setNewSong({
      title: song.title,
      author: song.author,
      lyrics: song.lyrics,
    });
    setShowAddSong(true);
  };

  const deleteSong = (songId: string) => {
    setSongs((currentSongs) => currentSongs.filter((song) => song.id !== songId));

    if (editingSongId === songId) {
      setEditingSongId(null);
      setNewSong({ title: '', author: '', lyrics: '' });
      setShowAddSong(false);
    }
  };

  const addSongToService = (song: Song) => {
    const item: ServiceItem = {
      id: `item${Date.now()}`,
      type: 'song',
      title: song.title,
      content: song.lyrics,
      refId: song.id,
    };
    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) =>
        meeting.id === currentMeetingId
          ? { ...meeting, items: [...meeting.items, item] }
          : meeting,
      ),
    );
  };

  const updateCurrentMeetingTitle = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) =>
        meeting.id === currentMeetingId ? { ...meeting, title: trimmed } : meeting,
      ),
    );
  };

  const addAgendaItem = (item: ServiceItem) => {
    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) =>
        meeting.id === currentMeetingId
          ? { ...meeting, items: [...meeting.items, item] }
          : meeting,
      ),
    );
    setCurrentPreviewItem(item);
  };

  const addWelcomeToService = () => {
    const item: ServiceItem = {
      id: `item${Date.now()}`,
      type: 'welcome',
      title: 'Pantalla de Bienvenida',
      content: 'Bienvenidos!\n\nHoy es un dia especial para adorar juntos.',
    };
    addAgendaItem(item);
  };

  const createMeeting = () => {
    setMeetingDraftTitle('');
    setShowMeetingCreator(true);
  };

  const saveNewMeeting = () => {
    const title = meetingDraftTitle.trim() || `Nueva reunión ${meetings.length + 1}`;
    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title,
      createdAt: Date.now(),
      items: [],
    };

    setMeetings((currentMeetings) => [newMeeting, ...currentMeetings]);
    setCurrentMeetingId(newMeeting.id);
    setCurrentPreviewItem(null);
    setShowMeetingCreator(false);
    setShowMenu(false);
  };

  const openComposerMenu = () => {
    setShowMenu((current) => !current);
  };

  const openSongPicker = () => {
    setSongPickerSearch('');
    setSelectedSongIds([]);
    setShowSongPicker(true);
    setShowMenu(false);
  };

  const openBiblePicker = () => {
    setBibleDraft({ title: 'Lectura bíblica', passages: '' });
    setShowBiblePicker(true);
    setShowMenu(false);
  };

  const openTextEditor = (type: Exclude<ServiceItem['type'], 'song' | 'bible'>) => {
    setAgendaType(type);
    setAgendaDraft({
      title: type === 'announcement' ? 'Anuncio' : 'Video',
      content:
        type === 'announcement'
          ? 'Escribe aquí el anuncio para la reunión.'
          : 'Pega aquí el enlace o describe el video.',
    });
    setShowTextEditor(true);
    setShowMenu(false);
  };

  const saveTextDraft = () => {
    if (!agendaType) return;
    const title = agendaDraft.title.trim();
    const content = agendaDraft.content.trim();
    if (!title || !content) return;

    addAgendaItem({
      id: `item${Date.now()}`,
      type: agendaType,
      title,
      content,
    });
    setShowTextEditor(false);
  };

  const saveSongSelection = () => {
    selectedSongIds.forEach((songId) => {
      const song = songs.find((entry) => entry.id === songId);
      if (song) addSongToService(song);
    });
    setShowSongPicker(false);
  };

  const saveBibleDraft = () => {
    const title = bibleDraft.title.trim();
    const passages = bibleDraft.passages.trim();
    if (!title || !passages) return;

    addAgendaItem({
      id: `item${Date.now()}`,
      type: 'bible',
      title,
      content: passages,
    });
    setShowBiblePicker(false);
  };

  const projectItem = (item: ServiceItem) => {
    setCurrentPreviewItem(item);
  };

  const removeAgendaItem = (id: string) => {
    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) =>
        meeting.id === currentMeetingId
          ? { ...meeting, items: meeting.items.filter((item) => item.id !== id) }
          : meeting,
      ),
    );
    if (currentPreviewItem?.id === id) {
      setCurrentPreviewItem(null);
    }
  };

  const moveAgendaItem = (id: string, direction: -1 | 1) => {
    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) => {
        if (meeting.id !== currentMeetingId) return meeting;
        const index = meeting.items.findIndex((item) => item.id === id);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= meeting.items.length) return meeting;

        const nextItems = [...meeting.items];
        [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
        return { ...meeting, items: nextItems };
      }),
    );
  };

  const updateZocalo = <Key extends keyof ZocaloSettings>(
    key: Key,
    value: ZocaloSettings[Key],
  ) => {
    setZocalo((previous) => ({ ...previous, [key]: value }));
  };

  const toggleProjectionFullscreen = () => {
    const elem = document.getElementById('projection-preview');
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
      setIsProjectionFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsProjectionFullscreen(false);
    }
  };

  const renderLyrics = (lyrics: string) => {
    return lyrics.split('\n').map((line, index) => {
      const isSection = line.startsWith('[') && line.endsWith(']');

      return (
        <div
          key={`${line}-${index}`}
          className={`lyric-line ${
            isSection ? 'font-semibold text-blue-400 mt-4 mb-1 text-lg' : 'mb-1'
          }`}
        >
          {line}
        </div>
      );
    });
  };

  const filteredSongs = songs.filter((song) => {
    const query = songSearch.trim().toLowerCase();
    if (!query) return true;
    return [song.title, song.author, song.lyrics].some((value) =>
      value.toLowerCase().includes(query),
    );
  });

  const meetingItems = currentMeeting?.items ?? [];
  const filteredSongPicker = songs.filter((song) => {
    const query = songPickerSearch.trim().toLowerCase();
    if (!query) return true;
    return [song.title, song.author, song.lyrics].some((value) =>
      value.toLowerCase().includes(query),
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">ProyecFlow</h1>
            <p className="text-xs text-slate-500 -mt-1">
              v0.1 - Personalizado para tu iglesia
            </p>
          </div>
        </div>

        <button
          onClick={toggleProjectionFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Monitor className="w-4 h-4" />
          {isProjectionFullscreen ? 'Salir pantalla completa' : 'Abrir pantalla de proyeccion'}
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('songs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'songs' ? 'bg-blue-600' : 'hover:bg-slate-800'
              }`}
            >
              <Music className="w-5 h-5" /> Biblioteca de Cantos
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'planner' ? 'bg-blue-600' : 'hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-5 h-5" /> Planificador
            </button>
            <button
              onClick={() => setActiveTab('zocalo')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'zocalo' ? 'bg-blue-600' : 'hover:bg-slate-800'
              }`}
            >
              <Palette className="w-5 h-5" /> Configurar Zocalo
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          {showMeetingCreator && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
              <div className="bg-slate-900 rounded-2xl w-full max-w-lg p-8">
                <h3 className="text-2xl font-semibold mb-3">Nueva reunión</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Poné el nombre de la reunión antes de armar la agenda.
                </p>
                <input
                  type="text"
                  value={meetingDraftTitle}
                  onChange={(event) => setMeetingDraftTitle(event.target.value)}
                  placeholder="Ejemplo: Reunion Domingo"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                  autoFocus
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowMeetingCreator(false)}
                    className="px-6 py-2.5 rounded-xl hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveNewMeeting}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-xl font-medium"
                  >
                    Guardar reunión
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSongPicker && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
              <div className="bg-slate-900 rounded-2xl w-full max-w-4xl p-8 max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold">Seleccionar Cantos</h3>
                    <p className="text-slate-400 text-sm">Marcá las canciones que querés cargar en orden.</p>
                  </div>
                  <button
                    onClick={() => setShowSongPicker(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="relative mb-4">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={songPickerSearch}
                    onChange={(event) => setSongPickerSearch(event.target.value)}
                    placeholder="Buscar canto"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex-1 overflow-auto border border-slate-800 rounded-2xl">
                  <div className="divide-y divide-slate-800">
                    {filteredSongPicker.map((song) => {
                      const checked = selectedSongIds.includes(song.id);
                      return (
                        <button
                          key={song.id}
                          onClick={() =>
                            setSelectedSongIds((current) =>
                              current.includes(song.id)
                                ? current.filter((id) => id !== song.id)
                                : [...current, song.id],
                            )
                          }
                          className={`w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-800 ${
                            checked ? 'bg-slate-800/70' : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{song.title}</div>
                            <div className="text-sm text-slate-400 truncate">{song.author}</div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                              checked
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'border-slate-600'
                            }`}
                          >
                            {checked ? '✓' : ''}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-slate-400">
                    {selectedSongIds.length} canción{selectedSongIds.length === 1 ? '' : 'es'} seleccionada{selectedSongIds.length === 1 ? '' : 's'}
                  </div>
                  <button
                    onClick={saveSongSelection}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-xl font-medium"
                  >
                    Agregar a reunión
                  </button>
                </div>
              </div>
            </div>
          )}

          {showBiblePicker && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
              <div className="bg-slate-900 rounded-2xl w-full max-w-3xl p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold">Cargar Biblia</h3>
                    <p className="text-slate-400 text-sm">
                      Poné un título y abajo los pasajes o el texto bíblico completo.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBiblePicker(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={bibleDraft.title}
                    onChange={(event) =>
                      setBibleDraft((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Titulo de la lectura"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                  />
                  <textarea
                    rows={10}
                    value={bibleDraft.passages}
                    onChange={(event) =>
                      setBibleDraft((current) => ({ ...current, passages: event.target.value }))
                    }
                    placeholder={`Ejemplo:\nJuan 3:16\nPorque de tal manera amó Dios al mundo...`}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowBiblePicker(false)}
                    className="px-6 py-2.5 rounded-xl hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveBibleDraft}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-xl font-medium"
                  >
                    Agregar a reunión
                  </button>
                </div>
              </div>
            </div>
          )}

          {showTextEditor && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
              <div className="bg-slate-900 rounded-2xl w-full max-w-3xl p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {agendaType === 'video' ? 'Agregar Video' : 'Agregar Anuncio'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Escribí el título y el contenido que querés proyectar.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTextEditor(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Titulo"
                    value={agendaDraft.title}
                    onChange={(event) =>
                      setAgendaDraft((current) => ({ ...current, title: event.target.value }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                  />
                  <textarea
                    placeholder={
                      agendaType === 'video'
                        ? 'Enlace o descripcion del video'
                        : 'Texto del anuncio'
                    }
                    rows={8}
                    value={agendaDraft.content}
                    onChange={(event) =>
                      setAgendaDraft((current) => ({
                        ...current,
                        content: event.target.value,
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowTextEditor(false)}
                    className="px-6 py-2.5 rounded-xl hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveTextDraft}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-xl font-medium"
                  >
                    Agregar a reunión
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'songs' && (
            <div className="flex-1 p-6 overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-semibold">Biblioteca de Cantos</h2>
                  <p className="text-slate-400">Tus canciones guardadas</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={songSearch}
                      onChange={(event) => setSongSearch(event.target.value)}
                      placeholder="Buscar canto"
                      className="w-72 max-w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <button
                    onClick={startCreateSong}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-medium"
                  >
                    <Plus className="w-4 h-4" /> Agregar nuevo canto
                  </button>
                </div>
              </div>

              {showAddSong && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
                  <div className="bg-slate-900 rounded-2xl w-full max-w-2xl p-8">
                    <h3 className="text-2xl font-semibold mb-6">
                      {editingSongId ? 'Editar Canto' : 'Nuevo Canto'}
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Titulo del canto"
                        value={newSong.title}
                        onChange={(event) =>
                          setNewSong({ ...newSong, title: event.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                      />
                      <input
                        type="text"
                        placeholder="Autor"
                        value={newSong.author}
                        onChange={(event) =>
                          setNewSong({ ...newSong, author: event.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                      />
                      <textarea
                        placeholder="Letra..."
                        rows={10}
                        value={newSong.lyrics}
                        onChange={(event) =>
                          setNewSong({ ...newSong, lyrics: event.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 font-mono text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowAddSong(false)}
                        className="px-6 py-2.5 rounded-xl hover:bg-slate-800"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={addSong}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-xl font-medium"
                      >
                        {editingSongId ? 'Guardar Cambios' : 'Guardar Canto'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1.4fr_0.9fr_auto] gap-4 px-5 py-3 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-800">
                  <div>Canto</div>
                  <div>Autor</div>
                  <div className="text-right">Acciones</div>
                </div>
                <div className="divide-y divide-slate-800">
                  {filteredSongs.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-400">
                      No encontramos canciones con ese buscador.
                    </div>
                  ) : (
                    filteredSongs.map((song) => (
                      <div
                        key={song.id}
                        className="grid grid-cols-[1.4fr_0.9fr_auto] gap-4 px-5 py-4 items-center hover:bg-slate-800/40"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{song.title}</div>
                          <div className="text-xs text-slate-500 truncate mt-1">
                            {song.lyrics.substring(0, 110)}...
                          </div>
                        </div>
                        <div className="text-sm text-slate-300 truncate">{song.author}</div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => addSongToService(song)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white"
                            aria-label={`Agregar ${song.title}`}
                            title="Agregar a la reunión"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEditSong(song)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950"
                            aria-label={`Editar ${song.title}`}
                            title="Editar canto"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSong(song.id)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white"
                            aria-label={`Eliminar ${song.title}`}
                            title="Eliminar canto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'planner' && (
            <div className="flex flex-1 overflow-hidden">
              <aside className="w-[20rem] max-w-full border-r border-slate-800 p-6 overflow-auto">
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="min-w-0">
                    <h2 className="text-3xl font-semibold">Planificaciones</h2>
                    <p className="text-slate-400">
                      Tus planificaciones guardadas. Elegí una para ordenar su contenido.
                    </p>
                  </div>
                  <button
                    onClick={createMeeting}
                    className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Nueva reunión
                  </button>
                </div>

                <div className="space-y-2">
                  {meetings.map((meeting) => {
                    const active = meeting.id === currentMeetingId;
                    return (
                      <button
                        key={meeting.id}
                        onClick={() => {
                          setCurrentMeetingId(meeting.id);
                          setCurrentPreviewItem(null);
                          setShowMenu(false);
                        }}
                        className={`w-full text-left rounded-2xl border px-4 py-4 transition-colors ${
                          active
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{meeting.title}</div>
                            <div className={`text-xs mt-1 ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                              {meeting.items.length} elemento{meeting.items.length === 1 ? '' : 's'}
                            </div>
                          </div>
                          <div className={`text-xs shrink-0 ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                            {new Date(meeting.createdAt).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <section className="flex-1 px-8 py-6 overflow-auto relative">
                <div className="mx-auto w-full max-w-4xl">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="min-w-0">
                      <h3 className="text-3xl font-semibold truncate">Planificación de culto</h3>
                      <p className="text-slate-400">{currentMeetingTitle}</p>
                    </div>

                    <div className="relative shrink-0">
                      <button
                        onClick={openComposerMenu}
                        data-testid="planner-add-item"
                        className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center shrink-0"
                        aria-label="Agregar elemento"
                        title="Agregar elemento"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      {showMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                          <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-2 z-50">
                            <button
                              onClick={openSongPicker}
                              data-testid="planner-menu-songs"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left hover:bg-slate-800"
                            >
                              <span>Cantos</span>
                              <ChevronDown className="w-4 h-4 rotate-[-90deg] text-slate-400" />
                            </button>
                            <button
                              onClick={openBiblePicker}
                              data-testid="planner-menu-bible"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left hover:bg-slate-800"
                            >
                              <span>Biblia</span>
                              <ChevronDown className="w-4 h-4 rotate-[-90deg] text-slate-400" />
                            </button>
                            <button
                              onClick={() => openTextEditor('announcement')}
                              data-testid="planner-menu-announcement"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left hover:bg-slate-800"
                            >
                              <span>Anuncio</span>
                              <ChevronDown className="w-4 h-4 rotate-[-90deg] text-slate-400" />
                            </button>
                            <button
                              onClick={() => openTextEditor('video')}
                              data-testid="planner-menu-video"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left hover:bg-slate-800"
                            >
                              <span>Video</span>
                              <ChevronDown className="w-4 h-4 rotate-[-90deg] text-slate-400" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {meetingItems.length === 0 ? (
                    <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-12 text-center text-slate-400">
                      Tocá `+` para agregar cantos, biblia, anuncios o videos a esta planificación.
                    </div>
                  ) : (
                    <div className="mx-auto max-w-3xl space-y-2">
                      {meetingItems.map((item, index) => (
                        <div
                          key={item.id}
                          className={`service-item flex justify-between items-center gap-3 p-4 bg-slate-900 border border-slate-700 rounded-2xl ${
                            currentPreviewItem?.id === item.id ? 'active' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-xs shrink-0">
                              {index + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{item.title}</div>
                              <div className="text-xs text-slate-500 capitalize">{item.type}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => moveAgendaItem(item.id, -1)}
                              className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl"
                              aria-label={`Subir ${item.title}`}
                              title="Subir"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveAgendaItem(item.id, 1)}
                              className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl"
                              aria-label={`Bajar ${item.title}`}
                              title="Bajar"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => projectItem(item)}
                              className="px-4 py-1.5 text-xs bg-blue-600 rounded-xl flex items-center gap-1"
                            >
                              <Play className="w-3.5 h-3.5" /> Proyectar
                            </button>
                            <button
                              onClick={() => removeAgendaItem(item.id)}
                              className="p-2 text-red-400 hover:bg-red-950 rounded-xl"
                              aria-label={`Eliminar ${item.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'zocalo' && (
            <div className="p-8 max-w-4xl mx-auto w-full overflow-auto">
              <h2 className="text-3xl font-semibold mb-8">Configurar Zocalo Predeterminado</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm" htmlFor="zocalo-bg">
                      Color de fondo
                    </label>
                    <input
                      id="zocalo-bg"
                      type="color"
                      value={zocalo.backgroundColor}
                      onChange={(event) => updateZocalo('backgroundColor', event.target.value)}
                      className="w-20 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm" htmlFor="zocalo-text">
                      Color del texto
                    </label>
                    <input
                      id="zocalo-text"
                      type="color"
                      value={zocalo.textColor}
                      onChange={(event) => updateZocalo('textColor', event.target.value)}
                      className="w-20 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm" htmlFor="zocalo-opacity">
                      Opacidad: {Math.round(zocalo.opacity * 100)}%
                    </label>
                    <input
                      id="zocalo-opacity"
                      type="range"
                      min="0.4"
                      max="1"
                      step="0.05"
                      value={zocalo.opacity}
                      onChange={(event) =>
                        updateZocalo('opacity', Number.parseFloat(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm" htmlFor="zocalo-height">
                      Altura: {zocalo.height}px
                    </label>
                    <input
                      id="zocalo-height"
                      type="range"
                      min="50"
                      max="110"
                      value={zocalo.height}
                      onChange={(event) =>
                        updateZocalo('height', Number.parseInt(event.target.value, 10))
                      }
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="pt-4 space-y-3 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={zocalo.showLogo}
                        onChange={(event) => updateZocalo('showLogo', event.target.checked)}
                      />
                      Mostrar logo
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={zocalo.showChurchName}
                        onChange={(event) => updateZocalo('showChurchName', event.target.checked)}
                      />
                      Mostrar nombre de la iglesia
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={zocalo.showDynamicTitle}
                        onChange={(event) => updateZocalo('showDynamicTitle', event.target.checked)}
                      />
                      Mostrar titulo dinamico
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm text-slate-400">Vista previa</p>
                  <div className="projection-screen h-80 rounded-3xl border border-slate-700 relative flex items-end overflow-hidden">
                    <div
                      className="zocalo w-full flex items-center justify-between px-8 text-sm"
                      style={{
                        backgroundColor: zocalo.backgroundColor,
                        color: zocalo.textColor,
                        opacity: zocalo.opacity,
                        height: `${zocalo.height}px`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {zocalo.showLogo && (
                          <div className="w-7 h-7 bg-white/10 rounded flex items-center justify-center">
                            +
                          </div>
                        )}
                        {zocalo.showChurchName && <span>{churchName}</span>}
                      </div>
                      <div>{zocalo.showDynamicTitle ? 'Grande eres tu' : ''}</div>
                      <div className="text-xs opacity-70">En vivo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
