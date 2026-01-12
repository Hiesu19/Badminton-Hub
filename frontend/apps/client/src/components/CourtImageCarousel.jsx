import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { fetchPublicImages } from '../services/imageService.js';

export default function CourtImageCarousel({ courtId }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courtId) return;
    const loadImages = async () => {
      setLoading(true);
      try {
        const data = await fetchPublicImages({
          type: 'gallery',
          supperCourtId: courtId,
        });
        setImages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [courtId]);

  if (!courtId) return null;

  return (
    <Box sx={{ mt: 2 }}>
      {loading ? (
        <CircularProgress size={24} />
      ) : images.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chưa có ảnh gallery.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            overflowX: 'auto',
            pb: 1,
          }}
        >
          {images.map((img) => (
            <Box
              key={img.key}
              component="a"
              href={img.url}
              target="_blank"
              rel="noreferrer"
              sx={{
                display: 'block',
                width: 140,
                height: 90,
                borderRadius: 2,
                boxShadow: '0 8px 24px rgba(15, 46, 36, 0.12)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <Box
                component="img"
                src={img.url}
                alt={img.key}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
