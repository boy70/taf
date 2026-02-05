"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { MapPin, Users, Zap, ExternalLink } from "lucide-react"
import Image from "next/image"

interface OrganizationCardProps {
  id: string
  name: string
  profile?: {
    profileImageUrl?: string
    bio?: string
    location?: string
  }
  _count?: {
    user: number
    event: number
    project: number
  }
  index?: number
}

export function OrganizationCard({ id, name, profile, _count, index = 0 }: OrganizationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/organizations/${id}`}>
        <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
          {/* Cover Image Area */}
          <div className="h-32 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 opacity-80 overflow-hidden relative">
            {profile?.profileImageUrl && (
              <Image
                src={profile.profileImageUrl}
                alt={name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            )}
          </div>

          <CardHeader className="pb-2 -mt-8 relative z-10">
            <div className="flex items-end space-x-3">
              {profile?.profileImageUrl && (
                <div className="w-16 h-16 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <Image
                    src={profile.profileImageUrl}
                    alt={name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 truncate">{name}</h3>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {profile?.bio && <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>}

            {profile?.location && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}

            {_count && (
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Users className="w-3 h-3 mr-1" />
                  {_count.user} Members
                </Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Zap className="w-3 h-3 mr-1" />
                  {_count.event} Events
                </Badge>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white group transition-all">
              <span>View Profile</span>
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
