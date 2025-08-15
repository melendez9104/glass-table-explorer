import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <Card className="p-4 glass-card">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <motion.div
              className="h-6 bg-muted/50 rounded w-48"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="h-4 bg-muted/30 rounded w-32"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
          </div>
          <div className="flex space-x-2">
            <motion.div
              className="h-10 bg-muted/40 rounded w-64"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
            <motion.div
              className="h-10 bg-muted/40 rounded w-20"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6
              }}
            />
          </div>
        </div>
      </Card>

      {/* Table Skeleton */}
      <Card className="glass-card overflow-hidden">
        <div className="p-4">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 mb-4 pb-4 border-b border-border/30">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-muted/40 rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>

          {/* Table Rows */}
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-4 mb-3">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <motion.div
                  key={colIndex}
                  className="h-8 bg-muted/30 rounded"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (rowIndex * 0.1) + (colIndex * 0.02)
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination Skeleton */}
      <Card className="p-4 glass-card">
        <div className="flex items-center justify-between">
          <motion.div
            className="h-4 bg-muted/40 rounded w-32"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="flex space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-8 w-8 bg-muted/40 rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          className="glass rounded-lg p-4"
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-muted/50 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted/40 rounded w-3/4" />
              <div className="h-3 bg-muted/30 rounded w-1/2" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};